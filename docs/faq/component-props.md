# How to use component props or data

Easy. Instead of defining `metaInfo` as an object, define it as a function and access `this` as usual:

**Post.vue:**
```html
<template>
  <div>
    <h1>{{{ title }}}</h1>
  </div>
</template>

<script>
  export default {
    name: 'post',
    props: ['title'],
    data () {
      return {
        description: 'A blog post about some stuff'
      }
    },
    metaInfo () {
      return {
        title: this.title,
        meta: [
          { vmid: 'description', name: 'description', content: this.description }
        ]
      }
    }
  }
</script>
```

**PostContainer.vue:**
```html
<template>
  <div>
    <post :title="title"></post>
  </div>
</template>

<script>
  import Post from './Post.vue'

  export default {
    name: 'post-container',
    components: { Post },
    data () {
      return {
        title: 'Example blog post'
      }
    }
  }
</script>
```
