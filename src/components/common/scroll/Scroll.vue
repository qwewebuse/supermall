<template>
  <div class="wrapper" ref="wrapper">
      <div class="content">
          <slot></slot>
      </div>
  </div>
</template>

<script>
import Bscroll from 'better-scroll'
export default {
    name:'Scroll',
    data () {
        return {
            scroll:null
        }
    },
    props: {
        probeType:{
            type:Number,
            default:0
        },
        pullUpLoad:{
            type:Boolean,
            default:false
        }
    },
    mounted () {
        //1.创建scroll对象
        this.scroll=new Bscroll(this.$refs.wrapper,{
            //开启observe-dom插件
            observeDOM:true,
            click:true,
            probeType:this.probeType,
            pullUpLoad:this.pullUpLoad
        })
        this.scroll.scrollTo(0,0)
        
        //2.监听滚动位置
        this.scroll.on('scroll',(position) => {
            //console.log(position);
            this.$emit('scroll', position)
        })

        //3.监听scroll滚动到底部
        if (this.pullUpLoad){
            this.scroll.on('pullingUp',() => {
            //console.log('上拉加载更多');
            this.$emit('pullingUp')
            })
        }
    },
    methods: {
        scrollTo(x,y,time=300){
            this.scroll && this.scroll.scrollTo(x,y,time)
        },

        finishPullUp(){
            this.scroll.finishPullUp()
        },
        refresh(){
            this.scroll && this.scroll.refresh()
        },
        getScrolly(){
            return this.scroll ? this.scroll.y : 0
        }
    }
    
}
</script>

<style>

</style>