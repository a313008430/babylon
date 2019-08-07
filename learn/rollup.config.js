import ts from 'rollup-plugin-typescript2';//编译混
// import { uglify } from 'rollup-plugin-uglify';//代码混淆库
export default {
    input: './app/App.ts',
    external:[], // 告诉rollup，不打包three;将其视为外部依赖
    plugins: [
        ts({
            tsconfig: "tsconfig.json",
        }),
        // uglify({
        //     toplevel:true,//变量名也会压缩 高级压缩，如报错可取消
        // })
    ],
    output: {
        file: './dist/index.js',
        sourcemap: 'inline',
        format: 'umd',
        name: 'Game',//umd入口
        globals:{
            // 'babylonjs':'BABYLON',              //告诉rollup 全局变量THREE即是three'
        }
    }
    
}


// 1. amd -- 异步模块定义，用于像RequestJS这样的模块加载器。
// 2. cjs -- CommonJS, 适用于Node或Browserify/webpack
// 3. es -- 将软件包保存为ES模块文件。
// 4. iife -- 一个自动执行的功能，适合作为 <script>标签这样的。
// 5. umd -- 通用模块定义，以amd, cjs, 和 iife 为一体。