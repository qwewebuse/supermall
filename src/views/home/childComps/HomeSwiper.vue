<template>
    <swiper>
        <swiper-item v-for="(item,index) in banners" :key="index">
          <a :href="item.link">
            <img :src="item.image" alt="" @load="swiperImageLoad">
          </a>
        </swiper-item>
    </swiper>
</template>

<script>
import {Swiper, SwiperItem} from 'components/common/swiper'

export default {
    name:'HomeSwiper',
    props: {
        banners:{
            type:Array,
            default(){
                return []
            }
        }    
    },
    data () {
        return {
            isImageLoad:false
        }
    },
    methods: {
        swiperImageLoad(){
            if(!this.isImageLoad){
                this.$emit('swiperImageLoad');
                this.isImageLoad=true
            }    
        }
    },
    components: {
        Swiper,
        SwiperItem
    }
}
</script>

<style>

</style>