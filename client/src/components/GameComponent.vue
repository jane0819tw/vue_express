<template lang="pug">
  .game
    .result {{result===''?0:result}}
    #panel
      .note(v-for="(note,index) in notes" :class="[note.type,note.text===0?'zero':'']" @click="doMath(note)") {{note.text}}


</template>

<script>
export default {
  data() {
    return {
      result: "",
      status: "",
      formula: [],
      notes: [
        { type: "clear", text: "C" },
        { type: "del", text: "/" },
        { type: "mul", text: "X" },
        { type: "num", text: 7 },
        { type: "num", text: 8 },
        { type: "num", text: 9 },
        { type: "sub", text: "-" },
        { type: "num", text: 4 },
        { type: "num", text: 5 },
        { type: "num", text: 6 },
        { type: "add", text: "+" },
        { type: "num", text: 1 },
        { type: "num", text: 2 },
        { type: "num", text: 3 },
        { type: "equal", text: "=" },
        { type: "num", text: 0 }
      ]
    };
  },
  methods: {
    doMath(note) {
      switch (note.type) {
        case "num":
          this.doNum(note);
          break;
        case "clear":
          this.result = "";
          this.formula = [];
          break;
        case "equal":
          this.formula.push(+this.result);
          this.result = "";
          this.doFormula();
          break;
        default:
          this.formula.push(+this.result);
          // this.result = "";
          this.formula.push(note.type);
          this.status = "wait";
          break;
      }
    },
    doNum(note) {
      // 不要是空值
      if (this.result || note.text !== 0) {
        if (this.status === "wait") {
          this.result = "";
          this.status = "";
        }
        this.result += note.text + "";
      }
    },
    doFormula() {
      let num1 = this.formula.shift();
      while (this.formula.length) {
        let oporator = this.formula.shift();
        let num2 = this.formula.shift();
        this.result = this.doOperator(num1, oporator, num2);
        num1 = this.result;
      }
    },
    doOperator(num1, oporator, num2) {
      console.log(num1, oporator, num2);
      switch (oporator) {
        case "add":
          return num1 + num2;
        case "sub":
          return num1 - num2;
        case "mul":
          return num1 * num2;
        case "del":
          return num1 / num2;
      }
    }
  }
};
</script>

<style lang="sass">
@mixin size($w,$h:$w)
  width: $w
  height: $h
*
  border: 1px solid #000
.game
  // width: 500px
  display: inline-block
  padding: 1em
  background-color: rgba(0,0,0,0.8)
  .result
    margin-bottom: 1em
    background-color: #888
    font-size: 50px
    text-align: right
    +size(280px,70px)

  #panel
    display: grid
    // 1fr 1fr 1fr
    grid-template-columns: repeat(4,1fr)
    grid-template-rows: repeat(5,1fr)
    grid-gap: 3px
    +size(280px,350px)
    .note
      display: flex
      justify-content: center
      align-items: center
      font-size: 30px
      font-weight: 900
      background-color: #FF9301
      cursor: pointer
      transition: 0.3s
      
      &.num
        background-color: #ddd
      &.clear
        grid-column-start: 1
        grid-column-end: 3
        background-color: #73FDFF
      &.zero
        grid-column-start: 1
        grid-column-end: 4
      &.equal
        grid-row-start: 4
        grid-row-end: 6
        grid-column-start: 4
        grid-column-end: 5
      &:hover
        color: #fff
        background-color: lighten(#333,20)
</style>