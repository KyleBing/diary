<template>
    <div class="file-list-item">
        <div class="id">{{fileInfo.id}}</div>
        <div class="file-info">
            <div class="name clipboard" :data-clipboard="`https://kylebing.cn/${fileInfo.name}`" >{{fileInfo.name_original}}</div>
            <div class="size">{{(fileInfo.size/1024).toFixed(0)}} kb</div>
            <div class="description">{{fileInfo.description}}</div>
            <div class="date">{{fileInfo.date_time}}</div>
            <div :class="['file-type',
                {image: fileInfo.type.indexOf('image') > -1},
            ]">{{fileInfo.type}}</div>
        </div>

    </div>
</template>

<script>
import svgIcons from "../../assets/img/SvgIcons"
import ClipboardJS from "clipboard";
import utility from "../../utility";

export default {
    name: "FileListItem",
    props: {
        fileInfo: {
            type: Object,
            default:  {
                // "id": 19,
                // "name_original": "dog (1).gif",
                // "name": "upload/dog (1).gif",
                // "description": "表情-狗-跳舞",
                // "date_create": "2023-11-03T03:54:32.000Z",
                // "date_time": "2023-11-03 03:54:32",
                // "type": "image/gif",
                // "uid": 3,
                // "size": 1757080
            }
        },
    },
    computed: {
    },
    methods: {

    },

    mounted() {

    }
}
</script>

<style scoped lang="scss">
@import "../../scss/plugin";
@import "./file-list-item";
</style>
