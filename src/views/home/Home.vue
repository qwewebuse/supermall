<template>
  <div id="home">
      <nav-bar class="home-nav">
        <div slot="center">购物车</div>
      </nav-bar>
      <tab-control 
        :titles="['流行','新款','精选']" 
        @tabClick="tabClick"
        ref="tabControl1"
        class="tab-control" v-show="isTabFixed"
      ></tab-control>
      <scroll class="content" ref="scroll" 
      :probe-type="3" @scroll="contentScroll" 
      :pull-up-load="true" @pullingUp="loadMore">

        <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
        <recommend-view :recommends="recommends"></recommend-view>
        <feature-view></feature-view>
        <tab-control 
          :titles="['流行','新款','精选']" 
          @tabClick="tabClick"
          ref="tabControl2"
        ></tab-control>
        <goods-list :goods="showGoods"></goods-list>
      </scroll>
      <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import goodsList from 'components/content/goods/goodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'

import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

import {getHomeMultidata, getHomeGoods} from 'network/home'
import {debounce} from 'common/utils'


export default {
    name:'Home',
    components: {
      NavBar,
      TabControl,
      HomeSwiper,
      RecommendView,
      FeatureView,
      goodsList,
      Scroll,
      BackTop
    },
    activated () {
      this.$refs.scroll.refresh()
      this.$refs.scroll.scrollTo(0,this.saveY,0)
    },
    deactivated () {
      this.saveY=this.$refs.scroll.getScrolly()
    },
    data () {
      return {
        banners:[],
        recommends:[],
        goods:{
          'pop':{page:0,list:[]},
          'new':{page:0,list:[]},
          'sell':{page:0,list:[]},
        },
        currentType:'pop',
        isShowBackTop:false,
        tabOffsetTop:0,
        isTabFixed:false,
        saveY:0
      }
    },
    methods: {
      /**
       * 事件监听相关方法
       */
      tabClick(index){
        //console.log(index);
        switch(index){
          case 0:
            this.currentType='pop';
            break
          case 1:
            this.currentType='new';
            break
          case 2:
            this.currentType='sell';
            break
        }
        this.$refs.tabControl1.currentIndex=index;
        this.$refs.tabControl2.currentIndex=index;
      },
      backClick(){
        this.$refs.scroll.scrollTo(0,0);
      },
      contentScroll(position){
        //1.判断BackTop是否显示
        //console.log(position)
        this.isShowBackTop=(-position.y)>1000

        //2.决定tabControl是否吸顶(position:fixed)
        this.isTabFixed=(-position.y)>this.tabOffsetTop
      },
      
      loadMore(){
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad(){
        //2.请求tabControl的OffsetTop
        this.tabOffsetTop=this.$refs.tabControl2.$el.offsetTop
      },
            
      /**
       * 网络请求相关的方法
       */
      getHomeMultidata(){
        getHomeMultidata().then( res =>{
          console.log(res);
          this.banners=res.data.banner.list;
          this.recommends=res.data.recommend.list;
        })
      },
      getHomeGoods(type){
        const page=this.goods[type].page+1;
        getHomeGoods(type,page).then(res =>{
          console.log(res);
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page+=1;
          //完成上拉加载更多
          this.$refs.scroll.finishPullUp();
        })
      }
    },
    created () {
      //请求多个数据
      this.getHomeMultidata()
      //请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')  
    },
    mounted () {
      //1.图片加载完成的事件监听
      const refresh=debounce(this.$refs.scroll.refresh,50)
      //请求better-scroll刷新
      this.$bus.$on('itemImageLoad', ()=>{
        refresh()
        //this.$refs.scroll.refresh()
      })

    },
    computed: {
      showGoods(){
        return this.goods[this.currentType].list
      }
    }
    
}
</script>

<style scoped>
  #home{
    /* padding-top: 44px; */
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    /* 在使用浏览器原生滚动时，为了让导航不跟随一起滚动 */
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }

  .tab-control{
    position: relative;
    z-index: 9;
  }

  /* .content{
    //calc括号内运算符两边要加空格 
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  } */
  .content{
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
    }
</style>