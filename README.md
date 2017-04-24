# react-native-minicalendar

Simple mini calendar or date picker for React Native

## Installation

`npm install react-native-minicalendar --save`

## Usage

### Example:

At the top of the page

```js
import MiniCalendar from 'react-native-minicalendar';
```

Sample render() function

```js
  render() {
    return (
      <View style={styles.container}>
        <View style={{width: 200}}>
          <MiniCalendar
            showDayHeading={true}
            dayHeadings={['Su','Mo','Tu','We','Th','Fr','Sa']}
            onDateSelect={this.onDateSelect.bind(this)}
            startDate={moment().format('YYYY-MM-DD')}
            selectedDate={moment((new Date()).toISOString()).format('YYYY-MM-DD')}
            numberOfDaysToShow={7}
            enabledDaysOfTheWeek={['Mo','We','Fr']}
            isoWeek={false}
            disablePreviousDays={true}
            disableToday={false}
            dayStyle={{ textAlign: 'center', lineHeight: 56 }}
            headingStyle={{backgroundColor: 'navy', lineHeight: 26}}
            activeDayStyle={{backgroundColor: 'green', color: 'white'}}
            disabledDayStyle={{backgroundColor: 'grey', color: 'darkgrey'}}
            selectedDayStyle={{backgroundColor: 'orange', color: 'black'}}
          />
        </View>
      </View>
    );
  }
```

### Demo:
![Demo gif](./demo.gif)

Thanks to @license2e and the React Native community for the assistance.
MIT Licensed
