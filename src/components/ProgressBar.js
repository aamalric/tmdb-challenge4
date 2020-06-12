import {Lightning} from "wpe-lightning-sdk"

export default class ProgressBar extends Lightning.Component {
  static _template() {
    return {
      Background: {
        x: 0,
        y: 0,
        w: w => w,
        h: h => h,
        rect: true,
        color: 0xffffffff,
        Progress: {
          h: h => h,
          w: 0,
          rect: true,
          color: 0xff808080,
        },
      },
    }
  }

  set progressBgColor(color) {
    this.tag('Background').patch({
      color,
    })
  }

  set progressColor(color) {
    this.tag('Progress').patch({
      color,
    })
  }

  set progressPercent(v) {
    this.tag('Progress').patch({
      w: w => v * w,
    })
  }
}