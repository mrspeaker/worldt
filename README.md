# Worldt

Reddit ImgUr Explorer, made for the Oculus Rift.

Loads subreddit ImgUrl images as a 3d gallery. You can use it in a normal ol' browser, but it doesn't feel like you're browsing the future: so go get a Rift and a browser with VR support - see [MozVR.com](http://www.mozvr.com).

**Controls:**

    / to enter typing mode. Type a subreddit and hit enter.
    WSAD: Move
    Arrows: Rotate
    Q/E: Up 'n down
    Space: Remove an obelisk.
    Enter: When you are looking at a "/r/<subreddit>" obelisk, loads the subreddit.
    Z: reset VR sensor.

![reddit](https://cloud.githubusercontent.com/assets/129330/6380386/3bd59478-bd07-11e4-9e75-1526cd6aa7a0.png)


## Notes

The code uses a bunch of ES6 stuff: I'm using [jspm.io](http://jspm.io/) for building.

The base code (things in /lib: VRManager, VREffect etc) is from the [Sechelt demo](https://github.com/MozVR/sechelt)

## Todos

  * SO many things.
  * in-world instructions.
  * handle imgur galleries
  * non-square images
  * downscale big images (not even needed for Oculus rez)
  * minecraft-style double-tap-to-run.
