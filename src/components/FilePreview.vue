<template>
    <div class="preview-image">
        <slot/>
    </div>
    <div class="preview-file">
        <slot/>
    </div>
</template>

<script>
export default {
    name: "FilePreview",
    props: {
        fileType: {
            type: String,
            default: 'image'
        },
        fileData: {
            type: String, // base64
            default: null
        }
    }
}
</script>

<style scoped lang="scss">
@import "../scss/plugin";
.preview-image{

}
.preview-file{

}

</style>
