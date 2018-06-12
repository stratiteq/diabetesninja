# DiabetesNinja
A react native app for logging glucose, events and carbs. Food database.

[![Build status](https://build.appcenter.ms/v0.1/apps/4e1768b9-87d6-496a-a570-130254a349aa/branches/master/badge)](https://appcenter.ms)

Version 1.1

<img src="https://github.com/hanssonfredrik/diabetesninja/blob/master/logo-text.jpg" alt="DiabetesNinja-Logo" width="200px">


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development purposes.

### Prerequisites and virtual devices
You can run this app on a physical device without setting up a development environment. If you want to run your app on the iOS Simulator or an Android Virtual Device, please refer to the setup guide below.

Setup Guide: https://facebook.github.io/react-native/docs/getting-started.html#installing-dependencies

### Installing

Once you have your device or emulator ready you need to run a few npm commands to get this app up and running.

After cloning down the project, install the react-native CLI

```
npm install -g react-native-cli
```

Navigate to the root of the project and install all package references.

```
npm install
```

Then to run the app while you have a device connected or an emulator running
##### For Android
```
react-native run-android
```
##### For IOS
```
react-native run-ios
```

### Development Dependencies
The diabetesninja-app trades data with an API that currently lives outside this repository.
During development you can use our sandbox-API to mock all API-calls except registration of new users.

https://sandbox.diabetesninja.se/swagger/ui

The sandbox-API will give you access to 4 users:

| Users-accounts | Description |
| -------------- | ----------- |
| user1@diabetesninja.se | Logger of data, has 2 followers |
| user2@diabetesninja.se | Logger of data, has 0 followers |
| follower1@diabetesninja.se | Subscribes to user1's data and can log new data for user1 |
| follower2@diabetesninja.se | Subscribes to user1's data and can log new data for user1 |

The password for all test-users is "Test1234"

## Built With

* [ESlint](https://eslint.org/) - A pluggable linting utility for JavaScript.
* [i18n](https://github.com/mashpie/i18n-node/) - It's a small library to provide the Rails I18n translations on the JavaScript.
* [wix/react-navigation](https://github.com/wix/react-native-navigation/) - A complete native navigation solution for React Native.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTOR.md) for details on our code of conduct, and the process for submitting pull requests to us.


## Authors

http://diabetesninja.se/

See also the list of [contributors](https://github.com/stratiteq/diabetesninja/contributors) who participated in this project.

## License

This project is licensed under the GPLv3 License - see the [LICENSE.md](LICENSE) file for details

## Acknowledgments

* Hat tip to anyone who's code was used
* And a big THANK YOU to all those who have supported this project with a download or a contribution
