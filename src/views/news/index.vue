<template>
    <div>
        <el-form :inline="true" :model="searchWhere" class="demo-form-inline" style="margin-top:20px">
        <el-form-item label="">
            <el-input v-model="searchWhere.title" placeholder="标题" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary"  icon="el-icon-search" @click="fetchData">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right" v-if="showAddNews">
            <el-button type="primary"  @click="showAddNewsForm()">添加</el-button>
        </el-form-item>
        </el-form>

        <el-card class="box-card" shadow="hover" v-for="news in newsList" :data="newsList">
            <div class="text item">
                <span @click="showNewsDetails(news.text)" id="newsTitle">{{ news.title }}</span>
                <el-button type="danger" style="float:right" @click="confirmAndDelete(news)" v-if="showDelete">删除</el-button>
                <el-button type="primary" style="float:right" @click="showNewsWithId(news)" v-if="showEdit">编辑</el-button>
            </div>
            
        </el-card>

        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[8, 10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        
        <!-- 添加文章 -->
        <el-dialog title="添加文章" :visible.sync="dialogFormVisibleAddNews">
        <el-form 
        :model="addNewsForm" 
        :rules="addNewsRules"
        :ref="addNewsForm"
        >
            <el-form-item label="文章标题" :label-width="formLabelWidth" prop="title">
                <el-input v-model="addNewsForm.title" autocomplete="off" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item label="文章类型" :label-width="formLabelWidth" prop="type">
                <el-select v-model.number="addNewsForm.type" placeholder="请选择文章类型">
                    <el-option label="新闻动态" :value="1"></el-option>
                    <el-option label="最新进展" :value="2"></el-option>
                    <el-option label="通知公告" :value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文章内容" :label-width="formLabelWidth" prop="text">
                <div class="vue-quill-editor">
                    <quill-editor
                        ref="mwQuillEditor"
                        v-model="addNewsForm.text"
                        :options="editorOption"
                    />
                </div>
                <!-- <quill-editor v-model="addNewsForm.text" class="editor" :options="editorOption"/> -->
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="cancelAddNewsForm()">取 消</el-button>
            <el-button type="primary" @click="addNews(addNewsForm)">确 定</el-button>
        </div>
        </el-dialog>

        <!-- 编辑文章 -->
        <el-dialog title="编辑文章" :visible.sync="dialogFormVisibleUpdateNews">
        <el-form 
        :model="updateNewsForm" 
        :rules="addNewsRules"
        :ref="updateNewsForm"
        >
            <el-form-item label="文章标题" :label-width="formLabelWidth" prop="title">
                <el-input v-model="updateNewsForm.title" autocomplete="off" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item label="文章类型" :label-width="formLabelWidth" prop="type">
                <el-select v-model.number="updateNewsForm.type" placeholder="请选择文章类型">
                    <el-option label="新闻动态" :value="1"></el-option>
                    <el-option label="最新进展" :value="2"></el-option>
                    <el-option label="通知公告" :value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文章内容" :label-width="formLabelWidth" prop="text">
                 <div class="vue-quill-editor">
                    <quill-editor
                        ref="mwQuillEditor"
                        v-model="updateNewsForm.text"
                        :options="editorOption"
                    />
                </div>
                <!-- <quill-editor v-model="updateNewsForm.text" class="editor" :options="editorOption"/> -->
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="cancelUpdateNewsForm()">取 消</el-button>
            <el-button type="primary" @click="updateNews(updateNewsForm)">确 定</el-button>
        </div>
        </el-dialog>

        <!-- 查看文章 -->
        <el-dialog title="详情" :visible.sync="dialogFormVisibleNewsDetails" class="box-card">
            <!-- <quill-editor v-model="newsDetails.text" class="text" :options="editorOptionShowNews"/> -->
            <!-- <p v-html='newsDetails.text'>{{ newsDetails.text }}</p> -->
            
            <p class="ql-editor" v-html="newsDetails.text"></p>
        </el-dialog>
    </div>
</template>

<script>
    import newsApi from '@/api/news'

    import { quillEditor, Quill } from 'vue-quill-editor'
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    // import SelectImages from '@/components/SelectImages/index'

    // 设置字体大小
    const fontSizeStyle = Quill.import('attributors/style/size') // 引入这个后会把样式写在style上
    fontSizeStyle.whitelist = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px']
    Quill.register(fontSizeStyle, true)
    // 设置字体样式
    const Font = Quill.import('attributors/style/font') // 引入这个后会把样式写在style上
    const fonts = [
        'SimSun',
        'SimHei',
        'Microsoft-YaHei',
        'KaiTi',
        'FangSong'
    ]
    Font.whitelist = fonts // 将字体加入到白名单
    Quill.register(Font, true)
    // 工具栏
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
        [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
        [{ align: [] }], // 对齐方式-----[{ align: [] }]
        [{ size: fontSizeStyle.whitelist }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
        [{ font: fonts }], // 字体种类-----[{ font: [] }]
        [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
        [{ direction: 'ltl' }], // 文本方向-----[{'direction': 'rtl'}]
        [{ direction: 'rtl' }], // 文本方向-----[{'direction': 'rtl'}]
        [{ indent: '-1' }, { indent: '+1' }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
        [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
        [{ script: 'sub' }, { script: 'super' }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
        ['blockquote', 'code-block'], // 引用  代码块-----['blockquote', 'code-block']
        ['clean'], // 清除文本格式-----['clean']
        // ['link', 'image', 'video'] // 链接、图片、视频-----['link', 'image', 'video']
    ]

    export default {
        // quill-editor相关配置
        name: 'VueQuillEditor',
        components: {
            quillEditor
        },
        props: {
            value: {
                type: [Number, Object, Array, String],
                default: ''
            }
        },
        data() {
            return {
                newsList: [],
                total: 0,
                currentPage: 1,
                pageSize: 8,
                searchWhere: {
                    title: '',
                    type: this.$route.meta.type
                },
                dialogFormVisibleAddNews: false,
                dialogFormVisibleUpdateNews: false,
                dialogFormVisibleNewsDetails: false,
                addNewsForm: {
                    title: '',
                    type: null,
                    text: '',
                },
                formLabelWidth: '120px',
                addNewsRules: {
                    title: [
                        { required: true, message: '请输入标题', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请选择类型', trigger: 'blur' }
                    ],
                    text: [
                        { required: true, message: '请输入内容', trigger: 'blur' }
                    ]
                },
                updateNewsForm: {
                    id: 0,
                    title: '',
                    type: null,
                    text: '',
                    is_del: 0
                },
                newsDetails: {
                    text: ''
                },
                user: JSON.parse(localStorage.getItem('user-info')),
                // qull-editor相关配置
                editorOption: {
                    placeholder: '输入内容……',
                    modules: {
                        toolbar: {
                            container: toolbarOptions,
                            handlers: {
                                image: this.handleImgUpload
                            }
                        }
                    }
                },
                isShow: false
            }
        },
        created() {
            this.fetchData();
        },
        watch: {
            $route() {
                this.searchWhere.type = this.$route.meta.type
                this.fetchData();
            },
            html: {
                handler (newValue) {
                    this.$emit('input', newValue)
                },
                deep: true
            },
            value: {
                handler (newValue, oldValue) {
                    if (newValue !== oldValue) this.html = newValue
                },
                deep: true
            }
        },
         mounted () {
            this.initMounted()
        },
        methods: {
            fetchData() {
                var queryOption = this.searchWhere
                if (this.currentPage == 1) {
                    queryOption.offset = 0
                } else {
                    queryOption.offset = (this.currentPage - 1) * this.pageSize + 1
                }
                queryOption.limit = this.pageSize
                // console.log(queryOption)
                newsApi.query(queryOption).then(response => {
                    // console.log(response.data)
                    if (response.data.msg == "") {
                        const data = response.data.data
                        this.newsList = data.news_list
                        this.total = data.total
                    } else {
                        this.$message({
                            message: response.msg,
                            type: "warning"
                        });
                    }
                })
            },
            showNewsDetails(newsText) {
                this.newsDetails.text = newsText
                this.dialogFormVisibleNewsDetails = true
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.fetchData();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.fetchData();
            },
            addNews(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        // console.log(this.addNewsForm)
                        newsApi.addNews(this.addNewsForm).then(response => {
                            const resp = response.data;
                            if (resp.msg == "") {
                                this.fetchData();
                                this.dialogFormVisibleAddNews = false;
                            } else {
                                this.$message({
                                    message: resp.msg,
                                    type: 'warning'
                                })
                            }
                        })
                    } else {
                        // console.log('error submit!');
                        this.dialogFormVisibleAddNews = true;
                    }
                })
            },
            showNewsWithId(news) {
                // console.log(news);
                this.updateNewsForm.id = news.id
                this.updateNewsForm.title = news.title;
                this.updateNewsForm.type = news.type;
                this.updateNewsForm.text = news.text;
                this.dialogFormVisibleUpdateNews = true;
            },
            updateNews(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        // console.log(this.updateNewsForm)
                        newsApi.updateNews(this.updateNewsForm).then(response => {
                            const resp = response.data;
                            if (resp.msg == "") {
                                this.fetchData();
                                this.dialogFormVisibleUpdateNews = false;
                            } else {
                                this.$message({
                                    message: resp.msg,
                                    type: 'warning'
                                })
                            }
                        })
                    } else {
                        // console.log('error update!');
                        this.dialogFormVisibleUpdateNews = true;
                    }
                })
            },
            showAddNewsForm() {
                this.addNewsForm = {
                    title: '',
                    type: null,
                    text: '',
                }
                this.dialogFormVisibleAddNews = true;
            },
            showUpdateNewsForm() {
                this.updateNewsForm = {
                    id: 0,
                    title: '',
                    type: null,
                    text: '',
                    is_del: 0
                }
                this.dialogFormVisibleUpdateNews = true;
            },
            cancelUpdateNewsForm() {
                this.dialogFormVisibleUpdateNews = false;
            },
            cancelAddNewsForm() {
                this.dialogFormVisibleAddNews = false;
            },
            confirmAndDelete(news) {
                this.$confirm('确认删除该文章?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    var updateNewsFormReq = {
                        id: news.id,
                        title: news.title,
                        type: news.type,
                        text: news.text,
                        is_del: 1
                    }
                    // console.log(updateNewsFormReq)
                    newsApi.updateNews(updateNewsFormReq).then(response => {
                        const resp = response.data;
                        if (resp.msg == "") {
                            this.fetchData();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        } else {
                            this.$message({
                                message: resp.msg,
                                type: 'warning'
                            })
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            initMounted () {
                setTimeout(() => {
                    this.isShow = true
                }, 100)
            },
            handleImgUpload () {
                // const { quill } = this.$refs.mwQuillEditor
                // SelectImages({
                //     visible: true,
                //     multi: true,
                //     showButton: true,
                //     maxMulti: 18,
                //     success: (data, filPath) => {
                //         for (const item of data) {
                //             const length = quill.getSelection(true).index
                //             // 获取光标所在位置
                //             // 插入图片，res为服务器返回的图片链接地址
                //             quill.insertEmbed(length, 'image', filPath + item)
                //             // 调整光标到最后
                //             quill.setSelection(length + 1)
                //         }
                //     }
                // })
            }
        },
        computed: {
            showAddNews () {
                return this.user.create_news == 1
            },
            showDelete () {
                return this.user.is_admin == 1
            },
            showEdit () {
                return this.user.is_admin == 1
            }
        }
    }
</script>


<style lang="scss">
  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 100%;
  }

//   .ql-container {
//     height: 400px;
//   }

  #newsTitle:hover {
      cursor: pointer;
      color: #409EFF;
  }

  /* .quill-editor{
    height: 300px;
  } */

  /* .ql-container{
    min-height: 192px;
  } */

  .vue-quill-editor {
    .quill-editor{
        line-height: normal;
        .ql-container.ql-snow{
            line-height: normal !important;
            height: 350px !important;
            font-size:12px;
        }
        .ql-snow {
            .ql-tooltip[data-mode=link]::before {
                content: "请输入链接地址:";
            }
            .ql-tooltip.ql-editing a.ql-action::after {
                border-right: 0px;
                content: '保存';
                padding-right: 0px;
            }
            .ql-tooltip[data-mode=video]::before {
                content: "请输入视频地址:";
            }
            .ql-picker.ql-size {
                .ql-picker-label[data-value="12px"]::before,
                .ql-picker-item[data-value="12px"]::before {
                    content: '12px';
                }
                .ql-picker-label[data-value="14px"]::before,
                .ql-picker-item[data-value="14px"]::before {
                    content: '14px';
                }
                .ql-picker-label[data-value="16px"]::before,
                .ql-picker-item[data-value="16px"]::before {
                    content: '16px';
                }
                .ql-picker-label[data-value="18px"]::before,
                .ql-picker-item[data-value="18px"]::before {
                    content: '18px';
                }
                .ql-picker-label[data-value="20px"]::before,
                .ql-picker-item[data-value="20px"]::before {
                    content: '20px';
                }
                .ql-picker-label[data-value="24px"]::before,
                .ql-picker-item[data-value="24px"]::before {
                    content: '24px';
                }
                .ql-picker-label[data-value="28px"]::before,
                .ql-picker-item[data-value="28px"]::before {
                    content: '28px';
                }
                .ql-picker-label[data-value="32px"]::before,
                .ql-picker-item[data-value="32px"]::before {
                    content: '32px';
                }
                .ql-picker-label[data-value="36px"]::before,
                .ql-picker-item[data-value="36px"]::before {
                    content: '36px';
                }
            }
            .ql-picker.ql-header {
                .ql-picker-label::before,
                .ql-picker-item::before {
                    content: '文本';
                }
                .ql-picker-label[data-value="1"]::before,
                .ql-picker-item[data-value="1"]::before {
                    content: '标题1';
                }
                .ql-picker-label[data-value="2"]::before,
                .ql-picker-item[data-value="2"]::before {
                    content: '标题2';
                }
                .ql-picker-label[data-value="3"]::before,
                .ql-picker-item[data-value="3"]::before {
                    content: '标题3';
                }
                .ql-picker-label[data-value="4"]::before,
                .ql-picker-item[data-value="4"]::before {
                    content: '标题4';
                }
                .ql-picker-label[data-value="5"]::before,
                .ql-picker-item[data-value="5"]::before {
                    content: '标题5';
                }
                .ql-picker-label[data-value="6"]::before,
                .ql-picker-item[data-value="6"]::before {
                    content: '标题6';
                }
            }
            .ql-picker.ql-font{
                .ql-picker-label[data-value="SimSun"]::before,
                .ql-picker-item[data-value="SimSun"]::before {
                    content: "宋体";
                    font-family: "SimSun" !important;
                }
                .ql-picker-label[data-value="SimHei"]::before,
                .ql-picker-item[data-value="SimHei"]::before {
                    content: "黑体";
                    font-family: "SimHei";
                }
                .ql-picker-label[data-value="Microsoft-YaHei"]::before,
                .ql-picker-item[data-value="Microsoft-YaHei"]::before {
                    content: "微软雅黑";
                    font-family: "Microsoft YaHei";
                }
                .ql-picker-label[data-value="KaiTi"]::before,
                .ql-picker-item[data-value="KaiTi"]::before {
                    content: "楷体";
                    font-family: "KaiTi" !important;
                }
                .ql-picker-label[data-value="FangSong"]::before,
                .ql-picker-item[data-value="FangSong"]::before {
                    content: "仿宋";
                    font-family: "FangSong";
                }
            }
        }
        .ql-align-center{
        text-align: center;
        }
        .ql-align-right{
        text-align: right;
        }
        .ql-align-left{
        text-align: left;
        }
    }
  }

</style>