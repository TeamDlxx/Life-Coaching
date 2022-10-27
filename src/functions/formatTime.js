import {View, Text} from 'react-native';
import React from 'react';

export default function formatTime(timeInSec) {
  let mins = parseInt(timeInSec / 60);
  let secs = parseInt(Math.ceil((timeInSec % 60) * 100) / 100);
  if (mins < 10) {
    mins = '0' + mins;
  }
  if (secs < 10) {
    secs = '0' + secs;
  }

  return mins + ':' + secs;
}
