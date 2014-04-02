Version Check
-----------
<a class="view-source" href="https://github.com/leapmotion/leapjs-plugins/tree/master/main/version-check" target="_blank">View Source</a>

This plugin is used to confirm a minimum LeapJS protocol version.  For an application or plugin which requires functionality specific to a minimum protocol, include and configure this plugin.

When a device is ready, it will check the protocol version and if outdated emit `versionCheck.outdated` from the controller with data e.g., `{current: 5, required: 6, disconnect: true}`.

## Options

 - **`disconnect`** `[boolean true]` If out of date, the controller will be disconnected, preventing any frames from being
 received, unless the disconnect option is set to false.

 - **`requiredProtocolVersion`** `[integer 6]` The required protocol version.

 - **`alert`** `[boolean false]` If out of date, show an alert dialog with the following message: "Your Leap Software version is out of date.  Visit http://www.leapmotion.com/setup to update"

## Usage

```js
  // from an app
  controller.use('versionCheck')

  // from a plugin:
  this.use('versionCheck')

  // while specifying options
  this.use('versionCheck', {requiredProtocolVersion: 6})
```
