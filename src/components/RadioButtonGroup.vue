<template>
  <div id="radio-button-group">
    <div class="content-title">
      <!--messageとamountを分ける?-->
      <!--v-bind:classでthis.expansionがfalseならbefore,trueならafterにclassを切り替える-->
      <button
        :class="{ 'button-rotate-before': !expansion,  'button-rotate-after': expansion }"
        @click="radioExpansion"><font size="4"> &#9651;</font></button>

      <slot></slot>: {{ defaultValue }}
    </div>

    <form id="target" v-if="expansion">

      <hr size="0.2" color="#969ca3" >

      <p class="radio-item">
        <input
          :id="'radio-item0-' + radioIdName"
          :checked="none.defaultValue"
          type="radio"
          name="radio-item"
          value="none"
          @change="radioChanged"
        >
        <label>{{ none.value }}</label>
      </p>

      <p class="radio-item">
        <input
          :id="'radio-item1-' + radioIdName"
          :checked="value1.defaultValue"
          type="radio"
          name="radio-item"
          value="item1"
          @change="radioChanged"
        >
        <textarea rows="1" cols="25" maxlength="25" v-model="value1.value"></textarea>
      </p>

      <p class="radio-item">
        <input
          :id="'radio-item2-' + radioIdName"
          :checked="value2.defaultValue"
          type="radio"
          name="radio-item"
          value="item2"
          @change="radioChanged"
        >
        <textarea rows="1" cols="25" maxlength="25" v-model="value2.value"></textarea>
      </p>

      <p class="radio-item">
        <input
          :id="'radio-item3-' + radioIdName"
          :checked="value3.defaultValue"
          type="radio"
          name="radio-item"
          value="item3"
          @change="radioChanged"
        >
        <textarea rows="1" cols="25" maxlength="25" v-model="value3.value">
        </textarea>
      </p>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import { RadioGroupValue } from '@/interface.ts';

// ID,class名をわかりやすいのに変えたほうがいい？
// このコンポーネントを複数個使ったとき動きがおかしくなるのでまずラジオボタンのID名をmountedで書き換える
// ラジオボタンのチェック時とチェックされている項目が書き換えられたときにデフォルトの値も書き換えるようになってる
// ラジオボタンの数を可変にできないか？

@Component
export default class RadioButtonGroup extends Vue {
  // 登録されている値。型を指定していたが、プロパティを使ったときに出る赤波線を消せなかったのでany
  @Prop() private receivedItems: RadioGroupValue[];
  // IDを書き換えるときに付与する名前
  @Prop() private radioIdName: string;

  private expansion: boolean = false;
  private none: RadioGroupValue = this.receivedItems[0];
  private value1: RadioGroupValue  = Object.assign({}, this.receivedItems[1]);
  private value2: RadioGroupValue = Object.assign({}, this.receivedItems[2]);
  private value3: RadioGroupValue = Object.assign({}, this.receivedItems[3]);
  private defaultValue: string | number = 0;

  // デフォルト値をセットする
  private created() {
    // defaultValueがtrueのものを探してthis.deFaultValueにセットする
    const items = [this.none, this.value1, this.value2, this.value3];
    for (const item of items) {
      if (item.defaultValue === true) {
        this.defaultValue = item.value;
        break;
      }
    }
  }

  // 設定値を返す。親から呼ぶ。
  private passData() {
    const items = [this.none, this.value1, this.value2, this.value3];

    // valueを数値に変換し、それが数字なら変換したものをvalueに入れる
    // 一度文字をうったあと数値を入れると型がstringになる。正しく入力したときにnumberに型を変換するために行う
    for (const item of items) {
      if (!isNaN((Number(item.value)))) {
        // ''は０に変換されてしまうのでifで回避
        if (item.value !== '') {
          item.value =  Number(item.value);
        }
      }
    }

    return {
      defaultValue: this.defaultValue,
      values: items,
    };
  }

  // ラジオボタンのチェックが変わったときにチェックされた値をデフォルトの値に書き換える
  // 手動でラジオボタンのチェックを変える
  private radioChanged(event: any) {
    // 前回どこがチェックされていたかわからないので全てのdefaultValueをfalseに変える
    const items = [this.none, this.value1, this.value2, this.value3];
    for (const item of items) {
      item.defaultValue = false;
    }

    // target.valueの値を取得してifで対応する項目のdefaultValueをtrueに切り替え
    const value = event.target.value;
    switch (value) {
      case 'none':
        this.none.defaultValue = true;
        break;
      case 'item1':
        this.value1.defaultValue = true;
        break;
      case 'item2':
        this.value2.defaultValue = true;
        break;
      case 'item3':
        this.value3.defaultValue = true;
        break;
      default:
        break;
    }

    // デフォルト値をチェックされた値に変更
    this.defaultValue = event.target.nextSibling.value;
  }

  private radioExpansion() {
    if (this.expansion) {
      this.expansion = false;
    } else if (!this.expansion) {
      this.expansion = true;
    }
  }

  // １つ目のラジオボタンのアイテムが書き換えられたときにデフォルトの値を書き換える
  @Watch('value1.value')
  private valueChanged1() {
    if (this.value1.defaultValue) {
      this.defaultValue = this.value1.value;
    }
  }

  // ２つ目のラジオボタンのアイテムが書き換えられたときにデフォルトの値を書き換える
  @Watch('value2.value')
  private valueChanged2() {
    if (this.value2.defaultValue) {
      this.defaultValue = this.value2.value;
    }
  }

  // 3つ目のラジオボタンのアイテムが書き換えられたときにデフォルトの値を書き換える
  @Watch('value3.value')
  private valueChanged3() {
    if (this.value3.defaultValue) {
      this.defaultValue = this.value3.value;
    }
  }
}
</script>

<style scoped>
/*スマホ*/
@media screen and (max-width: 800px) {
  /*全体*/
  #radio-button-group {
    box-shadow: 0.5px 0.5px 0.5px 0.5px rgba(85, 145, 160, 0.4);
    border-radius: 3px;
    margin-top: 15px;
    padding-top: 5px;
    padding-bottom: 3px;
  }

  textarea {
    display: inline;
    background-color: #eaf0f7;
    border: 0.1px solid #969ca3;
    border-radius: 5px;
  }

  button {
    background-color: transparent;
    color: #959fad;
    outline: none;
    border-style: none;
  }

  /*ボタンの向きを右にする。*/
  .button-rotate-before {
    transform: rotate(90deg);
    transition: 0.05s;
  }

  /*ボタンクリックで向きを下に回転させる*/
  .button-rotate-after {
    transform: rotate(180deg);
    transition: 0.05s;
  }

  /*設定する項目とデフォルトの値*/
  .content-title {
    font-size: 20px;
    margin-left: 5px;
    margin-bottom: 3px;
  }

  /*設定する項目のそれぞれのラジオボタンとテキスト*/
  .radio-item {
    font-size: 18px;
    margin-top: 8px;
    margin-left: 25px;
  }
}
</style>