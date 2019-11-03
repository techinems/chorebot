[![Build Status](https://cloud.drone.io/api/badges/rpiambulance/chorebot/status.svg)](https://cloud.drone.io/rpiambulance/chorebot)

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)

# ChoreBot

**ChoreBot** is primarily a service that takes assigned tasks right from a Google Sheet and posts them in a Slack channel. It allows chores to be assigned well in advance to ease the life of whoever does the scheduling. Secondarily, **ChoreBot** feeds [headsup](https://github.com/rpiambulance/headsup) with chore data to keep our info board updated.

### Setup

Setup of **ChoreBot** involves a few steps, but it isn't very difficult. You'll need to create an app on Slack, load our code onto your server, make a service account on Google, and set some environment variables.

#### Slack

1. Head over to [Slack's app portal](https://api.slack.com/apps), and create a new app.
1. Make sure you turn on "interactive components" and set your request URL to wherever you will be hosting the app. By default, [Bolt](https://slack.dev/bolt/)'s event endpoint is `/slack/events`, so your URL should probably end in that.
1. Create a bot user and call it whatever you wish.
1. After that, head up to "Install App" and install your app. Slack will take you through the permission approval process. You'll probably end up with an email that says you added an integration to your workspace.
1. Take note of the `Bot User OAuth Access Token` and the `Signing Secret`, the latter of which can be found on the "Basic Information" page.

#### Google

Two things are needed from Google: a spreadsheet must be created, and a service account must be made and given access to the sheet.

##### Spreadsheet

Your spreadsheet should comply with the following format:

| Date       | Chore         |
| ---------- | ------------- |
| 2019-10-04 | Chore1        |
| 2019-10-04 | Chore2        |
| 2019-10-05 | NextDayChore1 |
| ..         | ..            |

Note the format of the date (`YYYY-MM-DD`) and the fact that multiple chores can be listed per day, so long as the `Date` remains constant. If desired, you can use standard sheets formulas to produce any of the data in the spreadsheet.

##### Service account

Create a service account using [these instructions](https://developers.google.com/android/management/service-account). Once it's created, share the previously created spreadsheet with the service account's address. View-only permissions should be fine; we're only reading data from the sheet.

#### Your server

You can easily deploy this app using Docker Compose. Your `docker-compose.yml` file should look something like the following (we use [Traefik](https://traefik.io) for routing, FYI):

```
chorebot:
  build: https://github.com/rpiambulance/chorebot.git
  container_name: chorebot
  restart: always
  mem_limit: 500m
  labels:
    - "traefik.port=3000"
    - "traefik.frontend.rule=Host:chorebot.your_server_address.com"
  environment:
    - SPREADSHEET_ID=<spreadsheet ID>
    - SLACK_BOT_TOKEN=<xoxb Slack token>
    - SLACK_SIGNING_SECRET=<signing secret>
    - CHORES_CHANNEL=<channel>
    - CRON_SCHEDULE=0 18 * * *
    - TZ=America/New_York
  volumes:
    - /drone/chorebot/keys/sheets-api.json:/usr/src/app/keys/sheets-api.json
```

Fill in the environment variables as appropriate, and run a `docker-compose up -d chorebot`, or whatever you named your service.

## Credits

### Developers

- [Dan Bruce](https://github.com/ddbruce)

### License

**ChoreBot** is provided under the [MIT License](https://opensource.org/licenses/MIT).

### Contact

For any question, comments, or concerns, email [dev@rpiambulance.com](mailto:dev@rpiambulance.com), [create an issue](https://github.com/rpiambulance/chorebot/issues/new), or open up a pull request.
