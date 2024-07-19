// 场景
interface EntityMovieScene {
    id?: number,
    sceneTitle: string,  // 场景
    isDone?: boolean, // 是否已经录制
    desc: string, // 场景说明
    dialogues?: Array<EntityDialogue> // 对话
}

// 对话
interface EntityDialogue {
    character: string,
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
