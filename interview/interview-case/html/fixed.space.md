# 实现等宽等间距三列布局
面试官问: 现在要实现一个三列布局并且它们宽度自适应中间间距10px。
## 采用 flex
父元素设置 flex,子元素平分空间 然后中间采用margin 左右各10px
```html
 <section class="layout-flex">
        <style>
            .layout-flex>.left-center-right {
                display: flex;
                min-height: 200px;
            }

            .layout-flex>.left-center-right .left {
                flex: 1;
                background-color: orange;
            }

            .layout-flex>.left-center-right .right {
                flex: 1;
                background-color: orange;
            }

            .layout-flex>.left-center-right .center {
                flex: 1;
                margin: 0 10px;
                background-color: blue;
            }

        </style>
        <article class="left-center-right">
            <div class="left">left</div>
            <div class="center">center</div>
            <div class="right">right</div>
        </article>
    </section>
```
## 采用 float
主要借助box-sizing 特性。设置边框盒模型然后每个盒子设置 padding、并采用 background-clip裁剪内容区域，最后给父元素设置margin -10px 取出两边的间距。
```html
 <section class="layout-float">
        <style>
            .layout-float>.left-center-right {
                margin: 0 -5px;
                height: 100%;
                 display: flow-root; /*清除浮动 */
            }

            .layout-float>.left-center-right>div {
                box-sizing: border-box;
                width: 33.33%;
                height: 200px;
                padding: 0 5px;
                background-clip: content-box;
                float: left;
            }
            .layout-float>.left-center-right .left {
                background-color: gray;
            }

            .layout-float>.left-center-right .center {
                background-color: brown;
            }

            .layout-float>.left-center-right .right {
                background-color: black;

            }

        </style>
        <article class="left-center-right">
            <div class="left">left</div>
            <div class="center">center</div>
            <div class="right">right</div>
        </article>
    </section>
```
## 采用 margin calc 计算属性
该方法和采用 float 大致思想一致,只是现在with由 calc计算。
```html
 <section class="layout-margin-calc">
        <style>
            .layout-margin-calc .left-center-right {
                margin-left: -10px;
            }

            .layout-margin-calc .left-center-right div {
                float: left;
                height: 200px;
                width: calc(33.33% - 10px);
                margin-left: 10px;
            }

            .layout-margin-calc .left-center-right .left,
            .layout-margin-calc .left-center-right .right {
                background-color: orange;
            }

            .layout-margin-calc .left-center-right .center {
                background-color: gray;
            }

        </style>
        <article class="left-center-right">
            <div class="left">left</div>
            <div class="center">center</div>
            <div class="right">right</div>
        </article>
    </section>
```