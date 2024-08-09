<template>
    <div class="scene-container">
        <div v-if="formScenes.length === 0" class="operation-group">
            <div class="operation" @click="addScene()">+ 场景</div>
        </div>

        <div v-else class="scene" v-for="(scene, index) in formScenes" :key="index">
            <div class="scene-index">{{index + 1}}.</div>
            <div class="scene-wrapper">
                <div class="operation-group up">
                    <div class="operation" @click="addScene(index)">+ 场景</div>
                </div>
                <div class="scene-header">
                    <DInput
                        is-bold is-header
                        :rows="1"
                        v-model="scene.sceneTitle"/>
                </div>
                <div class="scene-description">
                    <DInput
                        placeholder="场景描述"
                        :rows="5"
                        v-model="scene.desc"/>
                </div>

                <div class="dialogue-list" v-if="scene.dialogues?.length > 0">
                    <div class="dialogue-item"
                         v-for="(dialogue, dialogueIndex) in scene.dialogues" :key="dialogueIndex"
                    >
                        <div class="operation-group up">
                            <div class="operation" @click="addDialogue(scene, dialogueIndex)">+</div>
                        </div>
                        <div class="character">
                            <DInput
                                is-bold
                                placeholder="角色"
                                :rows="1"
                                v-model="dialogue.character"/>
                        </div>
                        <div class="content">
                            <DInput
                                placeholder="对话"
                                :rows="3"
                                v-model="dialogue.content"/>
                        </div>
                        <div class="dialogue-scene-description">
                            <DInput
                                placeholder="说明"
                                :rows="2"
                                v-model="dialogue.sceneDescription"/>
                        </div>
                        <div class="operation-group down">
                            <div class="operation" @click="addDialogue(scene, dialogueIndex + 1)">+</div>
                            <div class="operation" @click="deleteDialogue(scene, dialogueIndex)">×</div>
                        </div>
                    </div>
                </div>
                <div class="operation-group down">
                    <div class="operation" @click="addScene(index+1)">+ 场景</div>
                    <div class="operation" @click="addDialogue(scene)">+ 对话</div>
                    <div class="operation" @click="deleteScene(index)">× 场景</div>
                </div>

            </div>
        </div>
    </div>

</template>


<script setup lang="ts">

import {onMounted, ref, watch} from "vue";
import {EntityMovieScene} from "@/view/Edit/Script/Script.ts";
import DInput from "@/view/Edit/Script/DInput.vue";
import Button from "@/components/Button.vue";

onMounted(()=>{
    console.log(model.value)
    // formScenes.value = JSON.parse(model.value)
})


const model = defineModel()

const formScenes = ref<Array<EntityMovieScene>>([
    {
        sceneTitle: '外景，路边，车边，白',
        desc: `镜头位于车后：开门，进入车内。\n镜头位于副驾：拍摄进入车内的过程\nGoPro镜头口含：拍摄车内坐下的的过程 `,
        dialogues: [
            {
                character: '我',
                content: '现在看到的是大众速腾 15款 灰色 手动挡 1.6L，看这个外观还是很可以的，我的审美好像停留在了 15 年。',
                sceneDescription: '缓缓走到车边，指着车'
            },
            {
                character: '我',
                content: '现在看到的是大众速腾 15款 灰色 手动挡 1.6L，看这个外观还是很可以的，我的审美好像停留在了 15 年。',
                sceneDescription: ''
            },
        ]
    }
])

function addDialogue(scene: EntityMovieScene, index?: number){
    if(!isNaN(index)){
        scene.dialogues?.splice(index, 0, {
            character: '',
            content: '',
            sceneDescription: ''
        })
    } else {
        // 到对话最后方
        if (!scene.dialogues){
            scene.dialogues = [{
                character: '',
                content: '',
                sceneDescription: ''
            }]
        } else {
            scene.dialogues.push({
                character: '',
                content: '',
                sceneDescription: ''
            })
        }

    }
}
function deleteDialogue(scene: EntityMovieScene, index: number) {
    scene.dialogues.splice(index, 1 )
}


function addScene(index?: number) {
    if (!isNaN(index)){
        formScenes.value.splice(index, 0, {
            sceneTitle: '',
            desc: '',
        })
    } else {
       formScenes.value.push({
           sceneTitle: '',
           desc: '',
       })
    }
}

function deleteScene(index: number) {
    formScenes.value.splice(index, 1 )
}


watch(formScenes, newValue => {
    model.value = JSON.stringify(newValue)
}, {deep: true})

// watch(model, newValue => {
//     formScenes.value = JSON.parse(newValue.value)
// })

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
    width: 100%;
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

    .scene-wrapper{
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        flex-grow: 1;
        &:hover{
            & > .operation-group{
                opacity: 1;
            }
        }
        .scene-header{
            width: 100%;
            font-weight: bold;
            background: $bg-light-td;
            margin-bottom: 10px;
        }

        .scene-description{
            width: 100%;
            line-height: 1.8;
        }

    }

}


.dialogue-list{
    width: 100%;
    padding: 20px 0;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    .dialogue-item{
        padding: 0 10px;
        width: 75%;
        @include border-radius($radius-pc);
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        &:hover{
            & > .operation-group{
                opacity: 1;
            }
        }
        .character{
            line-height: 2;
            font-weight: bold;
            text-align: center;
        }
        .content{
            line-height: 2;
            width: 70%;
        }
        .dialogue-scene-description{
            line-height: 2;
            width: 100%
        }

    }
}

$stretch-out-line-length: 30px;
.operation-group{
    @include transition(all 0.3s);
    opacity: 0;
    display: flex;
    justify-content: center;
    border: 1px solid $color-border;
    @include box-shadow(1px 1px 2px transparentize(black, 0.95));
    position: relative;
    &.up{
        border-bottom: none;
        @include border-radius($radius-mobile $radius-mobile 0 0);
    }
    &.down{
        border-top: none;
        @include border-radius(0 0 $radius-mobile $radius-mobile);
    }
    .operation{
        font-size: $fz-small;
        @extend .btn-like;
        line-height: 1;
        padding: 5px 20px;
        display: flex;
        align-items: center;
        &+.operation{
            border-left: 1px solid $color-border;
        }
    }
}

</style>
