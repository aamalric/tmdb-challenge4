// @todo: import MediaPlayer from SDK
import {Lightning, Utils, MediaPlayer} from "wpe-lightning-sdk";

import ProgressBar from '../components/ProgressBar'

const formatTime = (time) => {
  let secs = String(Math.floor(time % 60))
  secs = secs.length < 2 ? "0" + secs : secs
  let minutes = String(Math.floor(time / 60))
  minutes = minutes.length < 2 ? "0" + minutes : minutes
  const r = `${minutes}:${secs}`
  return r
}

export default class Player extends Lightning.Component {
    static _template() {
      return {
        MediaPlayer: {
          type: MediaPlayer,
        },
        Controls: {
          alpha: 0,
          transitions: {
            alpha: { duration: 1, timingFunction: 'linear' },
          },
          y: 980,
          h: 100,
          w: 1920,
          rect: true,
          colorBottom: 0x80000000,
          colorTop: 0x00000000,
          flex: {
            direction: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          },
          PlayPause: {
            w: 20,
            flexItem: {
              marginLeft: 100,
            },
            src: Utils.asset('mediaplayer/play.png')
          },
          Skip: {
            flexItem: {
              marginLeft: 50,
            },
            src: Utils.asset('mediaplayer/skip.png')
          },
          ProgressBar: {
            mountY: 1,
            flexItem: {
              alignSelf: 'center',
              grow: 1,
              marginLeft: 100,
            },
            type: ProgressBar,
            h: 5,
            progressBgColor: 0xff808080,
            progressColor: 0xffffffff,
          },
          Duration: {
            flexItem: {
              marginLeft: 20,
              marginRight: 100,
            },
            text: {
              text: '00:00 / 00:00',
              fontSize: 20,
              fontFace: "SourceSansPro-Bold",
              maxLines: 1,
            }
          },
        }
      }
    }

    _init() {
        this.tag('MediaPlayer').updateSettings({ consumer: this })
    }
   
     _active() {
       this.fireAncestors('$setBackgroundVisible', false)
     }
     
     _inactive() {
       this.fireAncestors('$setBackgroundVisible', true)
     }
     
     _focus() {
       this.tag('Controls').setSmooth('alpha', 1)
     }

     _unfocus() {
       this.tag('Controls').setSmooth('alpha', 0)
     }

     $mediaplayerProgress({ currentTime, duration }) {
      this.tag('ProgressBar').progressPercent = currentTime / duration
       
      const text = `${formatTime(currentTime)} / ${formatTime(duration)}`
      this.tag('Duration').patch({
        text: {
          text,
        }
      })
     }

    play(src, loop) {
      this.tag('MediaPlayer').loop = true
      this.tag('MediaPlayer').open(
        src,
        {
          hide: false,
        },
      )
    }

    stop() {

    }

    set item(v){
      this._item = v;
      this.play(v.stream, true)
    }


    $mediaplayerPause() {
      this._setState('Paused')
    }

    $mediaplayerPlay() {
      this._setState('Play')
    }

    static _states(){
        return [
            class Paused extends this{
                $enter(){
                    this.tag("PlayPause").src = Utils.asset("mediaplayer/pause.png");
                }
                _handleEnter(){
                  if (this.tag('MediaPlayer').isPlaying() === false) {
                    this.tag('MediaPlayer').doPlay()
                  }
                }
            },
            
            class Play extends this{
                $enter(){
                    this.tag("PlayPause").src = Utils.asset("mediaplayer/play.png");
                }
                _handleEnter(){
                  if (this.tag('MediaPlayer').isPlaying() === true) {
                    this.tag('MediaPlayer').doPause()
                  }
                }
            }

        ]
    }
}