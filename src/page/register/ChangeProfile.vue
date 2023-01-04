<template>
    <div class="body-login-bg" :style="`min-height: ${insets.windowsHeight}px`">
        <transition
            enter-active-class="animated-fast fadeIn"
            leave-active-class="animated-fast faceOut"
        >
            <div class="body-login" v-if="show">
                <div class="logo-wrapper mb-6">
                    <label class="logo avatar" for="avatar">
                        <img :src="formUser.avatar || icons.logoIcon.changeAvatar" alt="Diary Logo">
                    </label>
                    <input type="file" @change="uploadAvatar" id="avatar">
                </div>
                <form id="changeProfileForm">
                    <div class="input-group">
                        <label for="nickname">昵称</label>
                        <input v-model="formUser.nickname"
                               type="text"
                               name="nickname"
                               id="nickname">
                    </div>
                    <div class="input-group">
                        <label for="phone">手机号</label>
                        <input v-model.lazy="formUser.phone"
                               type="text"
                               name="phone"
                               id="phone">
                    </div>
                    <div class="input-group">
                        <label for="city">城市</label>
                        <input v-model="formUser.city"
                               type="text"
                               name="city"
                               id="city">
                    </div>
                    <div class="input-group">
                        <label for="geolocation">经纬度</label>
                        <input v-model="formUser.geolocation"
                               type="text"
                               disabled
                               name="geolocation"
                               id="geolocation">
                    </div>
                    <button class="btn mt-8 btn-active"
                            type="button"
                            @click.prevent="changeProfileSubmit">确定修改
                    </button>
                </form>
                <div class="footer flex-start">
                    <div class="link" @click="$router.go(-1)">返回</div>
                </div>
            </div>
        </transition>
    </div>
</template>


<script>
import userApi from "@/api/userApi"
import {mapState} from "vuex"
import SvgIcons from "@/assets/img/SvgIcons"
import utility from "@/utility"
import fileApi from "@/api/fileApi";
import * as qiniu from 'qiniu-js'
import projectConfig from "@/projectConfig";
import axios from "axios";

export default {
    name: 'ChangeProfile',
    data() {
        return {
            show: false,
            icons: SvgIcons,

            avatarFile: '', // 头像文件
            formUser:{
                nickname: '',
                phone: '',
                avatar: '',
                city: '',
                geolocation: '',
            },
            heightBg: 0
        }
    },
    mounted() {
        this.show = true
        document.title = '日记 - 注册' // 变更标题
        this.formUser.nickname = utility.getAuthorization().nickname
        this.formUser.phone = utility.getAuthorization().phone
        this.formUser.avatar = utility.getAuthorization().avatar
        this.formUser.city = utility.getAuthorization().city
        this.formUser.geolocation = utility.getAuthorization().geolocation

        // 在给 formUser.city 赋值之后再添加其 watcher
        this.$watch('formUser.city', newValue => {
            if (newValue.trim().length > 0){
                this.formUser.city = newValue
                // 根据城市名获取经纬度
                axios
                    .get('https://geoapi.qweather.com/v2/city/lookup',
                        {
                            params: {
                                key: projectConfig.HefengWeatherKey,
                                location: newValue, // 县区名
                                number: 1, // 返回数据数量 1-20
                            }
                        })
                    .then(res => {
                        if (res.data.code === '200'){
                            if (res.data.location.length > 0){
                                this.formUser.geolocation = `${res.data.location[0].lon},${res.data.location[0].lat}`
                            } else {
                                this.formUser.geolocation = ''
                            }
                        }
                    })
            }
        })
    },
    computed: {
        ...mapState(['insets']),
    },
    methods: {

        uploadAvatar(event){
            if (event.target.files.length > 0){
                this.avatarFile = event.target.files[0]
                if (!/image\/.*/.test(this.avatarFile.type)){
                    utility.popMessage('warning', '请选择图片文件')
                    event.target.value = '' // 清空 Input 内容
                    return
                }
                if (this.avatarFile.size > 1024 * 300){
                    utility.popMessage('warning', '头像文件应小于 300kb', null, 3)
                    event.target.value = '' // 清空 Input 内容
                    return
                }

                fileApi
                    .getUploadToken({
                        bucket: projectConfig.QiniuBucketName
                    })
                    .then(res => {
                        console.log('get token success')
                        // 上传文件
                        const observer = {
                            next: res => {
                                console.log('next: ',res)
                            },
                            error: err => {
                                console.log(err)
                            },
                            complete: res => {
                                // res = {hash: 'hash', key: 'key'}
                                console.log('complete: ',res)
                                this.formUser.avatar = projectConfig.QiniuImgBaseURL + res.key
                            }
                        }
                        const observable = qiniu.upload(this.avatarFile, null, res.data, {}, {})
                        const subscription = observable.subscribe(observer) // 上传开始
                        // subscription.unsubscribe() // 上传取消
                    })
                    .catch(err => {
                        utility.popMessage('danger', '获取上传 token 失败', null, 3)
                    })
            }
        },
        changeProfileSubmit() {
            userApi
                .setProfile(this.formUser)
                .then(res => {
                    utility.setAuthorization(
                        res.data.nickname,
                        res.data.uid,
                        res.data.email,
                        res.data.phone,
                        res.data.avatar,
                        res.data.password,
                        res.data.group_id,
                        res.data.city,
                        res.data.geolocation,
                    )
                    utility.popMessage('success', '修改成功', ()=>{
                        this.$router.go(-1)
                    }, 1)

                })
                .catch(err => {
                    utility.popMessage('danger', err.message)
                })
        }
    },
    watch: {
    }
}
</script>
