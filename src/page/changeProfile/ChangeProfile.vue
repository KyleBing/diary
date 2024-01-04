<template>
    <div class="body-login-bg" :style="`min-height: ${storeProject.insets.windowsHeight}px`">
        <transition
            enter-active-class="animated-fast fadeIn"
            leave-active-class="animated-fast faceOut"
        >
            <div class="body-login" v-if="show">
                <div class="logo-wrapper mb-6">
                    <label class="logo avatar" for="avatar">
                        <img v-if="formUser.avatar" :src="formUser.avatar + '-' + projectConfig.QiniuStyleSuffix || SVG_ICONS.logo_icons.logo_avatar" alt="Diary Logo">
                        <img v-else src="../../assets/icons/logo/logo_avatar.svg" alt="Avatar">
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
                    <div class="link" @click="router.go(-1)">返回</div>
                </div>
            </div>
        </transition>
    </div>
</template>


<script lang="ts" setup>
import userApi from "../../api/userApi.ts"
import fileApi from "../../api/fileApi.ts";
import * as qiniu from 'qiniu-js'
import projectConfig from "../../projectConfig.ts";
import axios from "axios";

import {popMessage, setAuthorization, getAuthorization} from "../../utility.ts";
import {useProjectStore} from "../../pinia";

const storeProject = useProjectStore();
import {onMounted, Ref, ref, watch} from "vue";
import {useRouter} from "vue-router";
import SVG_ICONS from "../../assets/icons/SVG_ICONS.ts";
import {UserProfileEntity} from "@/entity/User.ts";

const router = useRouter()


const show = ref(false)
let avatarFile = null // 头像文件
const formUser: Ref<UserProfileEntity> = ref({
    nickname: '',
    phone: '',
    avatar: '',
    city: '',
    geolocation: '',
})

onMounted(()=>{
    show.value = true
    document.title = '日记 - 资料修改' // 变更标题
    formUser.value.nickname = getAuthorization().nickname
    formUser.value.phone = getAuthorization().phone
    formUser.value.avatar = getAuthorization().avatar
    formUser.value.city = getAuthorization().city
    formUser.value.geolocation = getAuthorization().geolocation

    // 在给 formUser.city 赋值之后再添加其 watcher
    watch(() => formUser.value.city, newValue => {
        if (newValue.trim().length > 0){
            formUser.value.city = newValue
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
                            formUser.value.geolocation = `${res.data.location[0].lon},${res.data.location[0].lat}`
                        } else {
                            formUser.value.geolocation = ''
                        }
                    }
                })
        }
    })
})

function uploadAvatar(event){
    if (event.target.files.length > 0){
        avatarFile = event.target.files[0]
        if (!/image\/.*/.test(avatarFile.type)){
            popMessage('warning', '请选择图片文件')
            event.target.value = '' // 清空 Input 内容
            return
        }
        if (avatarFile.size > 1024 * 1024 * 3){
            popMessage('warning', '头像文件应小于 3M', null, 3)
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
                        formUser.value.avatar = projectConfig.QiniuImgBaseURL + res.key
                    }
                }
                const observable = qiniu.upload(avatarFile, null, res.data, {}, {})
                const subscription = observable.subscribe(observer) // 上传开始
                // subscription.unsubscribe() // 上传取消
            })
            .catch(err => {
                popMessage('danger', '获取上传 token 失败', null, 3)
            })
    }
}
function changeProfileSubmit() {
    userApi
        .setProfile(formUser.value)
        .then(res => {
            setAuthorization(
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
            popMessage('success', '修改成功', ()=>{
                router.go(-1)
            }, 1)

        })
        .catch(err => {
            popMessage('danger', err.message, null, 5)
        })
}
</script>


<style lang="scss">
@import "./change-profile";
</style>
