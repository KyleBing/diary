<template>
    <div class="scene-container">

        <div class="scene" v-for="(scene, index) in scenes" :key="index">
            <div class="scene-index">{{index + 1}}.</div>
            <div class="scene-content">
                <div class="scene-header">{{scene.sceneTitle}} </div>
                <div class="scene-description">
                    <p v-for="desc in scene.desc.split('\n')">{{desc}}</p>
                </div>
                <div class="dialogue-list" v-if="scene.dialogues?.length > 0">
                    <div class="dialogue-item" v-for="dialogue in scene.dialogues">
                        <div class="character">{{dialogue.character.name}}</div>
                        <div class="content">{{dialogue.content}}</div>
                        <div class="dialogue-scene-description">{{dialogue.sceneDescription}}</div>
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>


<script setup lang="ts">

import {ref} from "vue";
import {EntityMovieScene, EntityDialogue, EntityCharacter} from "@/view/Edit/Script/Script.ts";

const characterMe: EntityCharacter = {
    id: 1,
    name: '车主'
}


const scenes = ref<Array<EntityMovieScene>>([
    {
        sceneTitle: '外景，路边，白',
        desc: '从车尾到车头，镜头慢速从侧边画圆弧拍摄'
    },
    {
        sceneTitle: '外景，路边，车边，白',
        desc: `
        镜头位于车后：开门，进入车内。\n
        镜头位于副驾：拍摄进入车内的过程\n
        GoPro镜头口含：拍摄车内坐下的的过程
        `,
        dialogues: [
            {
                character: characterMe,
                content: '现在看到的是大众速腾 15款 灰色 手动挡 1.6L，看这个外观还是很可以的，我的审美好像停留在了 15 年。',
                sceneDescription: '缓缓走到车边，指着车'
            },
            {
                character: characterMe,
                content: '现在看到的是大众速腾 15款 灰色 手动挡 1.6L，看这个外观还是很可以的，我的审美好像停留在了 15 年。',
                sceneDescription: ''
            },
        ]
    },
    {
        sceneTitle: '外景，车内，白',
        desc: '整个内饰'
    },
    {
        sceneTitle: '外景，车内，白',
        desc: '操作按钮特写，旋转按钮的声音录制，'
    },
])


</script>


<style scoped lang="scss">
@import "../../../scss/plugin";

.scene-container{
    padding: 20px;
    border: 1px solid $color-border;
    @include border-radius($radius-mobile);
    //@include box-shadow(1px 1px 5px transparentize(black, 0.8));
    background-color: white;
}
.scene{
    margin-bottom: 20px;
    display: flex;
    flex-flow: row nowrap;
    .scene-index{
        width: 40px;
        font-family: 'JetBrainsMonoDiary', sans-serif;
        padding: 5px 20px 5px 5px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .scene-content{
        flex-grow: 1;
        .scene-header{
            padding: 5px 10px;
            font-weight: bold;
            background: $bg-light-td;
            margin-bottom: 10px;
        }

        .scene-description{
            line-height: 1.8;
            padding: 5px 5px;

        }
    }

}


.dialogue-list{
    padding: 20px 0;

    .dialogue-item{
        margin-bottom: 10px;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        .character{
            line-height: 2;
            font-weight: bold;
            text-align: center;
        }
        .content{
            line-height: 2;
            width: 50%;
        }
        .dialogue-scene-description{
            line-height: 2;

            width: 75%
        }

    }
}


</style>
