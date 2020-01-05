# vue_express 最小產品全端架構
practice to build a fullend project
### 使用express
```typescript=
// generate pckage.json
npm init
// install these 套件
npm i express cors body-parser mongodb
// 在開發環境中使用使用node
// 直接再scripts中寫執行node的指令
npm i -D nodemon
```
新增<code>start</code>、<code>dev</code>指令。
```typescript=
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server/index.js",
    "dev": "nodemon server/index.js "
  },
```

接著建立一個<code>server</code>資料夾包含<code>index.js</code>，新增下列內容: 
```typescript=
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

// connect middleware
app.use(bodyParser.json())
app.use(cors())

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`listen on port ${port}...`))
```
此時畫面話出現這段，表示找不到這個路由，(因為我們還沒新增)。
![](https://i.imgur.com/ABsQKpg.png)
接著再server底下新稱<code>routes/api/posts.js</code>

再<code>index.js</code>新增: 
```typescript=
const posts = require('./routes/api/posts')
app.use('/api/posts',posts)
```
接著，在<code>posts.js</code>裡面，來寫曾刪改查。
```typescript=
const express = require('express')
const mongodb = require('mongodb')

const router = express.Router()
// get data
router.get('/', (req, res) => {
  res.send('hello')
})

module.exports = router
```
到網頁上做測試: 
```typescript=
http://localhost:5000/api/posts
// hello
```

### 連結資料庫 mongodb
接下來要試著連結mongodb，先到mongodb官網上，依照操作步驟執行，最後到cluster的地方按下<code>connect</code>-><code>connect your application</code>，將這一串複製下來。
![](https://i.imgur.com/XDfFYzP.png)
建立<code>loadPostsCollection()</code>方法連結資料庫，
並改寫剛剛get的方法。
```typescript=
// posts.js 
const router = express.Router()
const mongodb_url = 'mongodb+srv://vue_express:vue_express@cluster0-ad0wr.mongodb.net/test?retryWrites=true&w=majority'

router.get('/', async (req, res) => {
  // res.send('hello')
  const posts = await loadPostsCollection()
  res.send(await posts.find({}).toArray())
})

async function loadPostsCollection() {
  const client = await mongodb.MongoClient.connect(mongodb_url, {
    useNewUrlParser: true
  })
  return client.db('vue_express').collection('posts')
}
```
處理好之後，在網址上測試，就會得到一個<code>[]</code>。

接著使用<code>post</code>方法新增，主要的語法在<code>insertOne</code>，表示插入一筆資料。
```typescript=
router.post('/', async (req, res) => {
  const posts = await loadPostsCollection()
  await posts.insertOne({
    text: req.body.text,
    createdAt: new Date()
  })
  res.status(201).send()
})
```
利用postman做測試。

接下來刪除的部分，主要利用<code>deleteOne</code>來刪除，而裡面的部分是放<code>filter</code>內容，想要取得的id因為是mongodb產生的隨機碼，所以需要用<code>new mongodb.ObjectID(req.params.id)</code>包住才可以刪除成功。
```typescript=
// delete
router.delete('/:id',async (req,res)=>{
  const posts = await loadPostsCollection()
  await posts.deleteOne({ _id: new mongodb.ObjectID(req.params.id)})
  res.status(200).send()
})
```
利用<code>updateOne</code>來更新一筆資料，第一個參數是filter的條件，第二個參數則是要更新的數值，需要使用<code>$set</code>這個來寫。
```typescript=
// update 
router.put('/:id', async (req, res) => {
  const posts = await loadPostsCollection()
  await posts.updateOne({ _id: new mongodb.ObjectID(req.params.id) }, { $set: { text: req.body.text } })
  res.status(201).send()
})
```

這個樣子後端的crud建立起來了喔
下一步我們要建立前端的部分。
### vue
先安裝<code>vue-cli</code>，一個快速安裝<code>vue</code>的工具。
```typescript=
npm install @vue/cli -g
// use sass and pug
npm install pug pug-loader pug-filters --save
npm install sass sass-loader node-sass --save
```
在根目錄新增<code>.gitignore</code>，這個檔案紀錄不要加到git追蹤的檔案。
```typescript=
// .gitignore
node_modules
/client
```
因為有vue-cli，所以接下來使用vue來新增一個前端框架叫做client的資料夾。
```typescript=
vue create client // 這個指令在vue-cli version 3才有
```
接著先加到git裡面。
```typescript=
git init
git add . && git commit -m 'initial backend created'
```

啟動vue。
```typescript=
cd client 
npm run serve
```
把<code>helloWorld</code>這個元件修正名字，改成<code>PostComponent</code>

接著修正成要使用的語言。
```typescript=
lang="pug" / lang="sass"
npm install pug pug-loader pug-filters --save
npm install pug-plain-loader
npm install sass sass-loader node-sass --save
```
向後端要資料，需要使用axios，所以
```typescript=
npm i axios
```
在client資料夾裡面的src資料夾底下建立<code>PostService.js</code>
新增靜態方法，表示可以直接使用，不用new 一個實體出來。
```typescript=
// PostService.js
const axios = require('axios')
const url = 'http://localhost:5000/api/posts'
class PostService {
  static getPosts() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(url)
        const data = res.data
        resolve(
          data.map(post => ({
            ...post,
            createdAt: new Date(post.createdAt)
          }))
        )
      } catch (err) {
        reject(err)
      }
    })
  }
}
export default PostService
```
至於在這裡的部分，<code>created</code>直接取用該元件的方法。
```typescript=
// PostComponent.vue
<script>
import PostService from "../PostService.js";

export default {
  name: "PostComponent",
  props: {
    msg: String
  },
  data() {
    return {
      posts: [],
      error: "",
      text: ""
    };
  },
  async created() {
    try {
      this.posts = await PostService.getPosts();
    } catch (err) {
      this.error = err;
    }
  }
};
</script>
```
這樣成功之後，接著來做新增的方法。
```typescript=
// PostService.js
 static insertPost(text) {
    return axios.post(url, { text })
  }
```

```typescript=
// PostComponent.vue
  methods: {
    async insertPost() {
      try {
        await PostService.insertPost(this.text);
      } catch (err) {
        this.error = err;
      }
      this.posts = await PostService.getPosts();
    }
  }
```
接下來實作刪除的部分。
```typescript=
// PostService.js
static deletePost(id) {
    return axios.delete(`${url}${id}`)
  }
```

```typescript=
// PostComponent.vue
async deletePost(id) {
      try {
        await PostService.deletePost(id);
      } catch (err) {
        this.error = err;
      }
      this.posts = await PostService.getPosts();
    }
```
最後是更新的部分。
```typescript=
// PostService.js
 static updatePost(id, text) {
    return axios.put(`${url}${id}`, { text })
  }
```

```typescript=
// PostComponent.vue
async updatePost(id) {
  try {
    await PostService.updatePost(id, this.text);
  } catch (err) {
    this.error = err;
  }
  this.posts = await PostService.getPosts();
}
```

### 利用key值來做更新
當key值變動的時候，元件會重新產生，動畫會跟著改變一遍。
```typescript=
// PostComponent.vue
li(v-for="(post,index) in posts" 
:key="post.createdAt.toString()" 
:style="{'animation-delay':index/3+'s'}")
// style
@keyframes fadeIn
  0%
    opacity: 0
  100%
    opacity: 1
    
li
  animation: fadeIn 2s both
```
### transition 搭配 key
將需要的動畫利用包在外層。調整參數 <code>mode</code>先離開再進來。
```typescript=
// 當路徑改變，重新產生這個元件，動畫也重新產生
transition(name="page" mode="out-in")
  router-view(:key="$route.path")
  
// style 
.page-enter-active,.page-leave-active
  transition: 0.5s
.page-enter,.page-leave-to
  opacity: 0
```

### vue router 使用
先再src底下建立一個資料夾，<code>router/index.js</code>
```typescript=
// router/index.js
import Vue from 'vue'
import Router from 'vue-router'
// @ 表示src這個資料夾
import PostComponent from '@/components/PostComponent'
import GameComponent from '@/components/GameComponent'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: PostComponent
    },
    {
      path: '/game',
      component: GameComponent
    }
  ]
})
```
並將<code>App.vue</code>改成使用 <code>router-link</code> 來載入該路徑的<code>component</code>模板，使用<code>$route.path</code>這一段。
```typescript=
router-link(to="/") show posts
router-link(to="/game") play Math

// 當路徑改變，重新產生這個元件，動畫也重新產生
transition(name="page" mode="out-in")
  router-view(:key="$route.path")
```
然而這時候還不能使用，會出現<code>$route</code>還沒有定義的錯誤，是因為我們沒有在整個專案裡面載入<code>Router</code>，因此，在<code>main.js</code>裡面，需要加入下列的語法，告知在整個專案中使用router，程式才可正式運作。
```typescript=
// main.js
import router from './router'
new Vue({
// add router here
  router,
  render: h => h(App),
}).$mount('#app')
```

如果遇到<code>Unexpected console statement (no-console) </code>問題，就要到.package.json裡面，在規則中新增<code>"no-console": "off"</code>來解決。
[參考文章](https://www.mls-tech.info/web/vue/vue-eslint-no-console/)
```typescript=
// vue--  package.json
"eslintConfig": {
    "rules": {
      "no-console": "off"
    }
  },
```
