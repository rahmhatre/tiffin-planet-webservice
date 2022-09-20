const express = require('express');
const notifications = express.Router();
const UserModel = require('../models/userModel');
const baseURL = '/notifications';
const { Expo } = require('expo-server-sdk');

notifications.post(baseURL, async (req, res) => {
  // Null check for the body
  if (!req?.body) {
    return res.status(400).json({ status: 400, message: 'Please check the body before sending notifications.' });
  }

  // Return error if the user is not supplied in the request body
  if (!req?.body?.userId) {
    return res.status(401).json({ status: 401, message: 'Please check the user supplied for sending notification.' });
  }

  // Search for the user in the db
  const user = await UserModel.findById(req?.body?.userId);
  if (!user) {
    return res.status(404).json({ status: 404, message: 'No result found.' });
  }

  // Create a new Expo SDK client
  // optionally providing an access token if you have enabled push security
  let expo = new Expo();

  // Create the messages that you want to send to clients
  let messages = [];

  // Check that all your push tokens appear to be valid Expo push tokens
  if (!Expo.isExpoPushToken(user?.expoPushNotificationToken)) {
    console.error(`Push token ${user?.expoPushNotificationToken} is not a valid Expo push token`);
    return res.status(404).json({ status: 400, message: `Push token ${user?.expoPushNotificationToken} is not a valid Expo push token` });
  }

  // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
  messages.push({
    to: user?.expoPushNotificationToken,
    sound: 'default',
    body: req?.body?.content?.body,
    data: req?.body?.content?.data,
    title: req?.body?.content?.title,
  });

  // The Expo push notification service accepts batches of notifications so
  // that you don't need to send 1000 requests to send 1000 notifications. We
  // recommend you batch your notifications to reduce the number of requests
  // and to compress them (notifications with similar content will get
  // compressed).
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  await (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);

        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
      } catch (error) {
        console.error(error);
      }
    }
  })();
  return res.status(201).json({ status: 201, message: 'Notification sent successfully.' });
});

notifications.post(`${baseURL}/all`, async (req, res) => {
  // Null check for the body
  if (!req?.body) {
    return res.status(400).json({ status: 400, message: 'Please check the body before sending notifications.' });
  }

  // Get all the users
  const users = await UserModel.find();
  if (!users) {
    return res.status(404).json({ status: 404, message: 'No result found.' });
  }

  const allUsersExpoNotificationToken = users
    .map((user) => {
      if (user.expoPushNotificationToken) {
        return user?.expoPushNotificationToken;
      }
      return null;
    })
    .filter(Boolean);

  if (!allUsersExpoNotificationToken?.length) {
    return res.status(400).json({ status: 400, message: 'No one is registered for push notification,.' });
  }

  // Create a new Expo SDK client
  // optionally providing an access token if you have enabled push security
  let expo = new Expo();

  // Create the messages that you want to send to clients
  let messages = [];

  // Iterate over all tokens
  allUsersExpoNotificationToken.forEach((expoToken) => {
    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(expoToken)) {
      console.error(`Push token ${expoToken} is not a valid Expo push token`);
      return;
    }

    // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
    messages.push({
      to: expoToken,
      sound: 'default',
      body: req?.body?.content?.body,
      data: req?.body?.content?.data,
      title: req?.body?.content?.title,
    });
  });

  // The Expo push notification service accepts batches of notifications so
  // that you don't need to send 1000 requests to send 1000 notifications. We
  // recommend you batch your notifications to reduce the number of requests
  // and to compress them (notifications with similar content will get
  // compressed).
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  await (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);

        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
      } catch (error) {
        console.error(error);
      }
    }
  })();
  return res.status(201).json({ status: 201, message: 'Notifications sent successfully.' });
});

module.exports = notifications;
