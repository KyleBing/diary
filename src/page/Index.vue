<template>
    <div>
        <navbar/>
        <div class="diary">
            <div class="diary-list" :style="`height:${insets.heightPanel}px`">
                <list/>
            </div>
            <div class="diary-container" :style="`height:${insets.heightPanel}px`">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script>
import list from "@/page/List"
import Navbar from "@/components/Navbar"
import {mapState} from 'vuex'

export default {
    name: 'Index',
    components: {
        Navbar,
        list
    },
    computed: {
        ...mapState(['insets'])
    }
}

</script>
