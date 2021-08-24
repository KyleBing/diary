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
            let icons = new Map()
            icons.set('保存','img/tabicon/done.svg')
            icons.set('添加','img/tabicon/add.svg')
            icons.set('关闭','img/tabicon/close.svg')
            icons.set('返回','img/tabicon/back.svg')
            icons.set('删除','img/tabicon/delete.svg')
            icons.set('编辑','img/tabicon/edit.svg')
            icons.set('菜单','img/tabicon/menu.svg')
            icons.set('恢复','img/tabicon/recover.svg')
            icons.set('搜索','img/tabicon/search.svg')
            icons.set('分享','img/tabicon/share.svg')
            return icons
        }
    },
}
</script>

<style scoped>

</style>
