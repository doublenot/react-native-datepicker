'use strict';
import React from 'react-native'
import moment from 'moment'
const {
  View,
  Text,
  TouchableOpacity,
  PropTypes,
  StyleSheet,
} = React

class MiniCalendar extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedDate: null,
      dayHeadings: this.props.dayHeadings || ['Su','Mo','Tu','We','Th','Fr','Sa'],
      showDayHeading: this.props.showDayHeading || true,
      enabledDaysOfTheWeek: this.props.enabledDaysOfTheWeek || ['Su','Mo','Tu','We','Th','Fr','Sa'],
      selectedDate: this.props.selectedDate || moment().format('YYYY-MM-DD'),
      startOfWeek: (this.props.isoWeek) ? 'isoWeek' : 'week',
      disablePreviousDays: this.props.disablePreviousDays || true,
      disableToday: this.props.disableToday || false,
    }
  }

  onDateSelect(date) {
    this.setState({
      selectedDate: date,
    }, () => {
      this.props.onDateSelect(date)
    })
  }

  renderWeek(weekIdx, actualStartDate) {
    const daysOfWeek = this.state.dayHeadings.map((dow, dowIdx) => {
      let dowStyle = styles.dayOfWeek
      let dowActiveStyle = styles.dayOfWeekActive
      let inactiveStyle = {}
      let activeDayStyle = {}
      let dowSelectedDateStyle = {}
      let selectedDayStyle = {}
      let disabledDate = false
      const fullDate = actualStartDate.format('YYYY-MM-DD')
      const displayDate = actualStartDate.format('D')
      let comparePreviousDiff = 86400000

      if(this.state.disableToday === true){
        comparePreviousDiff = 0
      }

      if(
        this.state.enabledDaysOfTheWeek.indexOf(dow) === -1
        || (this.state.disablePreviousDays === true && moment().diff(moment(fullDate)) > comparePreviousDiff)
      ){
        disabledDate = true
        dowActiveStyle = {}
        if(this.props.disabledDayStyle){
          inactiveStyle = Object.assign({}, inactiveStyle, this.props.disabledDayStyle)
        }
      } else if(this.props.activeDayStyle){
        activeDayStyle = Object.assign({}, activeDayStyle, this.props.activeDayStyle)
      }

      if(fullDate === this.state.selectedDate){
        dowSelectedDateStyle = styles.dayOfWeekSelected
        if(this.props.selectedDayStyle){
          selectedDayStyle = Object.assign({}, selectedDayStyle, this.props.selectedDayStyle)
        }
      }

      const dowElement = (
        <TouchableOpacity
          key={`${weekIdx}-${dowIdx}`}
          underlayColor='transparent'
          onPress={() => {
            if(disabledDate === false){
              this.onDateSelect(fullDate)
            }
          }}
          style={styles.dowStyleContainer}
        >
          <Text
            style={[dowStyle, inactiveStyle, dowActiveStyle, activeDayStyle, dowSelectedDateStyle, selectedDayStyle]}
          >
            {displayDate}
          </Text>
        </TouchableOpacity>
      )
      actualStartDate.add(1, 'days')
      return dowElement;
    })

    return (
      <View key={weekIdx} style={styles.dayOfWeekContainer}>
        {daysOfWeek}
      </View>
    )
  }

  render() {
    const {numberOfDaysToShow, numberOfPreviousDaysToShow, startDate} = this.props
    const {dayHeadings, startOfWeek} = this.state
    const totalNumberOfDaysToShow = (numberOfPreviousDaysToShow || 0 + numberOfDaysToShow || 0)
    const actualStartDate = moment(this.props.startDate).startOf(this.state.startOfWeek)

    let miniCalendarHeadings = null
    if(this.state.showDayHeading === true){
      const headingsList = this.state.dayHeadings.map((dowHeading, dowIdx) => {
        return (
          <View key={`heading-${dowIdx}`} style={styles.dowStyleContainer}>
            <Text style={[styles.dayOfWeekHeading, this.props.headingStyle || {}]}>{dowHeading}</Text>
          </View>
        )
      })

      miniCalendarHeadings = (
        <View key={'headings'} style={styles.dayOfWeekContainer}>
          {headingsList}
        </View>
      )
    }

    let miniCalendar = []
    for(let i = 0, j = Math.ceil(totalNumberOfDaysToShow/dayHeadings.length); i<j; i++){
      miniCalendar.push(this.renderWeek(i, actualStartDate))
    }

    return (
      <View style={styles.container}>
        {miniCalendarHeadings}
        {miniCalendar}
      </View>
    )
  }
}

MiniCalendar.PropTypes = {
  showDayHeading: PropTypes.bool,
  dayHeadings: PropTypes.array,
  enabledDaysOfTheWeek: PropTypes.array,
  startDate: PropTypes.string.isRequired,
  numberOfDaysToShow: PropTypes.number.isRequired,
  numberOfPreviousDaysToShow: PropTypes.number,
  selectedDate: PropTypes.string,
  onDateSelect: PropTypes.func.isRequired,
  isoWeek: PropTypes.bool,
  disablePreviousDays: PropTypes.bool,
  disableToday: PropTypes.bool,
  headingStyle: PropTypes.object,
  activeDayStyle: PropTypes.object,
  disabledDayStyle: PropTypes.object,
  selectedDayStyle: PropTypes.object,
}

const styles = StyleSheet.create({
  container: {

  },
  dayOfWeekContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  dayOfWeekHeading: {
    flex: 1,
    textAlign: 'center',
    margin: 1,
    paddingTop: 2,
    paddingBottom: 2,
    color: '#eee',
    backgroundColor: '#777',
  },
  dayOfWeek: {
    flex: 1,
    textAlign: 'center',
    margin: 1,
    paddingTop: 12,
    paddingBottom: 12,
    color: '#aaa',
    backgroundColor: '#ddd',
  },
  dayOfWeekActive: {
    color: '#222',
    backgroundColor: 'lightblue',
  },
  dayOfWeekSelected: {
    backgroundColor: 'yellow'
  },
  dowStyleContainer: {
    flex: 1,
  },
})

export default MiniCalendar
