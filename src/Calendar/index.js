import React from 'react';
import PropTypes from 'prop-types';
import MonthDropdown from './MonthDropdown';
import TimeDropdown from './TimeDropdown';
import MonthView from './MonthView';
import MonthHeader from './MonthHeader';
import WeekHeader from './WeekHeader';


const propTypes = {
  calendarState: PropTypes.string,
  selectedDate: PropTypes.instanceOf(Date),
  pageDate: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  onMoveForword: PropTypes.func,
  onMoveBackward: PropTypes.func,
  onSelect: PropTypes.func,
  onToggleMonthDropdown: PropTypes.func,
  onToggleTimeDropdown: PropTypes.func,
  onChangePageDate: PropTypes.func,
  dateFilter: PropTypes.func
};

function isDayChanged(dateA, dateB) {
  if (dateA && dateB) {
    return dateA.toDateString() !== dateB.toDateString();
  } else if (!dateA && !dateB) {
    return false;
  }
  return true;
}

class Calendar extends React.Component {

  shouldComponentUpdate(nextProps) {
    const props = this.props;
    return (
      nextProps.calendarState !== props.calendarState ||
      isDayChanged(nextProps.selectedDate, props.selectedDate) ||
      isDayChanged(nextProps.pageDate, props.pageDate) ||
      isDayChanged(nextProps.minDate, props.minDate) ||
      isDayChanged(nextProps.maxDate, props.maxDate)
    );
  }

  handleMoveForword = () => {
    const { onMoveForword, pageDate } = this.props;
    let nextPageDate = new Date(pageDate.getFullYear(), pageDate.getMonth() + 1);
    onMoveForword && onMoveForword(nextPageDate);
  }

  handleMoveBackward = () => {
    const { onMoveBackward, pageDate } = this.props;
    let nextPageDate = new Date(pageDate.getFullYear(), pageDate.getMonth() - 1);
    onMoveBackward && onMoveBackward(nextPageDate);
  }

  dateFilter = (date) => {
    const { minDate, maxDate, dateFilter } = this.props;
    if (minDate && date.getTime() < minDate.getTime()) {
      return false;
    }
    if (maxDate && date.getTime() > maxDate.getTime()) {
      return false;
    }
    if (dateFilter && !dateFilter(date)) {
      return false;
    }
    return true;
  }

  render() {
    const {
      calendarState,
      selectedDate,
      pageDate,
      onSelect,
      onToggleMonthDropdown,
      onToggleTimeDropdown,
      onChangePageDate
    } = this.props;

    const stateClassname = {
      SLIDING_L: ' sliding-left',
      SLIDING_R: ' sliding-right',
      DROP_MONTH: ' drop-month'
    }[calendarState] || '';


    return (
      <div className={`calendar${stateClassname}`}>
        <MonthHeader
          date={selectedDate}
          onMoveForword={this.handleMoveForword}
          onMoveBackward={this.handleMoveBackward}
          onToggleMonthDropdown={onToggleMonthDropdown}
          onToggleTimeDropdown={onToggleTimeDropdown}
        />
        <MonthDropdown
          date={pageDate}
          show={calendarState === 'DROP_MONTH'}
          onClick={onChangePageDate}
        />
        <TimeDropdown
          date={pageDate}
          show={calendarState === 'DROP_TIME'}
          onClick={onChangePageDate}
        />
        <WeekHeader />
        <MonthView
          date={pageDate}
          selected={selectedDate}
          onClick={onSelect}
          dateFilter={this.dateFilter}
        />
      </div>
    );
  }
}

Calendar.propTypes = propTypes;

export default Calendar;
