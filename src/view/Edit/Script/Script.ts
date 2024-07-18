// 场景
interface EntityMovieScene {
    id?: number,
    isDone: boolean, // 是否已经录制
    sceneTitle: string,  // 场景
    desc: string, // 场景说明
    dialogues?: Array<EntityDialogue> // 对话
}

// 对话
interface EntityDialogue {
    character: EntityCharacter,
    content: string
    sceneDescription: string,
}

// 角色
interface EntityCharacter {
    id: number,
    name: string
}

export {
    type EntityMovieScene,
    type EntityDialogue,
    type EntityCharacter,
}
