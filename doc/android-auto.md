# Android Auto

## Overview

The example app includes a `MediaBrowserService` that allows other Android devices, such as Android Auto, to
discover and browse our served content.

## Configuration

### Testing with the Desktop Head Unit

In a "real" setup, the car’s **head unit** acts as the "display" and controller.
The Android phone then runs the Android Auto app and streams UI and data to the car.

In a development setup, the
**[Desktop Head Unit (DHU)](https://developer.android.com/training/cars/testing/dhu)**
running on the development machine **simulates the car's head unit**,
but it needs to communicate with a phone that acts like it’s connected to a real head unit.
For this reason, it is necessary to run the **Android Auto Head Unit Server** on the phone that
mimics a real car head unit connection and enables communication between the phone and the DHU for testing.



