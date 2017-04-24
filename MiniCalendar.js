'use strict';
import React, { Component } from 'react'
import moment from 'moment'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

class MiniCalendar extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedDate: null,
      dayHeadings: (this.props.hasOwnProperty('dayHeadings') === true) ? this.props.dayHeadings : ['Su','Mo','Tu','We','Th','Fr','Sa'],
      showDayHeading: (this.props.hasOwnProperty('showDayHeading') === true) ? this.props.showDayHeading : true,
      enabledDaysOfTheWeek: (this.props.hasOwnProperty('enabledDaysOfTheWeek') === true) ? this.props.enabledDaysOfTheWeek : ['Su','Mo','Tu','We','Th','Fr','Sa'],
      selectedDate: (this.props.hasOwnProperty('selectedDate') === true) ? this.props.selectedDate : moment().format('YYYY-MM-DD'),
      startOfWeek: (this.props.isoWeek === true) ? 'isoWeek' : 'week',
      disablePreviousDays: (this.props.hasOwnProperty('disablePreviousDays') === true) ? this.props.disablePreviousDays : true,
      disableToday: (this.props.hasOwnProperty('disableToday') === true) ? this.props.disableToday : false,
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
            style={[
              dowStyle,
              this.props.dayStyle || {},
              inactiveStyle,
              dowActiveStyle,
              activeDayStyle,
              dowSelectedDateStyle,
              selectedDayStyle
            ]}
          >
            {displayDate}
          </Text>
        </TouchableOpacity>
      )
      actualStartDate.add(1, 'days')
      return dowElement;
    })

    return (
      <View key={weekIdx} style={[styles.dayOfWeekContainer, this.props.weekContainerStyle || {}]}>
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
        <View key={'headings'} style={[styles.dayOfWeekHeadingsContainer, this.props.headingContainerStyle || {}]}>
          {headingsList}
        </View>
      )
    }

    let miniCalendar = []
    for(let i = 0, j = Math.ceil(totalNumberOfDaysToShow/dayHeadings.length); i<j; i++){
      miniCalendar.push(this.renderWeek(i, actualStartDate))
    }

    return (
      <View style={[styles.container, this.props.containerStyle || {}]}>
        {miniCalendarHeadings}
        {miniCalendar}
      </View>
    )
  }
}

MiniCalendar.propTypes = {
  showDayHeading: React.PropTypes.bool,
  dayHeadings: React.PropTypes.array,
  enabledDaysOfTheWeek: React.PropTypes.array,
  startDate: React.PropTypes.string.isRequired,
  numberOfDaysToShow: React.PropTypes.number.isRequired,
  numberOfPreviousDaysToShow: React.PropTypes.number,
  selectedDate: React.PropTypes.string,
  onDateSelect: React.PropTypes.func.isRequired,
  isoWeek: React.PropTypes.bool,
  disablePreviousDays: React.PropTypes.bool,
  disableToday: React.PropTypes.bool,
  containerStyle: React.PropTypes.object,
  headingContainerStyle: React.PropTypes.object,
  headingStyle: React.PropTypes.object,
  weekContainerStyle: React.PropTypes.object,
  dayStyle: React.PropTypes.object,
  activeDayStyle: React.PropTypes.object,
  disabledDayStyle: React.PropTypes.object,
  selectedDayStyle: React.PropTypes.object,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dayOfWeekHeadingsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  dayOfWeekContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  dayOfWeekHeading: {
    flex: 1,
    textAlign: 'center',
    margin: 1,
    color: '#eee',
    backgroundColor: '#777',
    alignSelf: 'stretch',
  },
  dayOfWeek: {
    flex: 1,
    textAlign: 'right',
    margin: 1,
    color: '#aaa',
    backgroundColor: '#ddd',
    alignSelf: 'stretch',
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
    alignItems: 'center',
    flexDirection: 'row',
  },
})

export default MiniCalendar
