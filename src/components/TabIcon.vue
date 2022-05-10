<template>
    <img :alt="alt"
         :title="alt"
         :src="icons.get(alt)">
</template>

<script>
export default {
    name: "TabIcon",
    props:{
        alt: {
            type: String,
            require: true
        }
    },
    data(){
        return{}
    },
    computed:{
        icons(){
            let iconMap = new Map()
            iconMap.set('保存', this.$icons.tab.done)
            iconMap.set('添加', this.$icons.tab.add)
            iconMap.set('关闭', this.$icons.tab.close)
            iconMap.set('返回', this.$icons.tab.back)
            iconMap.set('删除', this.$icons.tab.delete)
            iconMap.set('编辑', this.$icons.tab.edit)
            iconMap.set('菜单', this.$icons.tab.menu)
            iconMap.set('恢复', this.$icons.tab.recover)
            iconMap.set('搜索', this.$icons.tab.search)
            iconMap.set('分享', this.$icons.tab.share)
            iconMap.set('内容隐藏', this.$icons.tab.contentHide)
            iconMap.set('内容显示', this.$icons.tab.contentShow)
            return iconMap
        }
    },
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/plugin";
img{
    display: block;
    height: $height-navbar;
}

</style>
