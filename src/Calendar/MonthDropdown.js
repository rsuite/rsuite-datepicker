// @flow

import * as React from 'react';
import classNames from 'classnames';
import { scrollTop } from 'dom-lib';
import moment from 'moment';
import { constants } from 'rsuite-utils/lib/Picker';
import { prefix, getUnhandledProps } from 'rsuite-utils/lib/utils';

import MonthDropdownItem from './MonthDropdownItem';
import scrollTopAnimation from '../utils/scrollTopAnimation';

type Props = {
  onSelect?: (month: moment$Moment, event: SyntheticEvent<*>) => void,
  show: boolean,
  date: moment$Moment,
  limitStartYear?: number,
  limitEndYear?: number,
  className?: string,
  classPrefix?: string
};

const minYear = 1950;
const blockHeight = 84;

class MonthDropdown extends React.PureComponent<Props> {
  static defaultProps = {
    classPrefix: `${constants.namespace}-calendar-month-dropdown`,
    show: false,
    limitStartYear: 5,
    limitEndYear: 5,
    date: moment()
  };

  componentDidMount() {
    this.updatePosition();
  }

  shouldComponentUpdate(nextProps: Props) {
    return nextProps.show;
  }

  componentDidUpdate() {
    this.updatePosition();
  }

  getStartYear() {
    const { date, limitStartYear = 5 } = this.props;
    const startYear = date.year() - limitStartYear;
    return Math.max(startYear, minYear);
  }

  updatePosition(props?: Props) {
    const { date } = props || this.props;
    date && this.scrollTo(date);
  }

  scrollTo = (date: moment$Moment) => {
    const year = date.year();
    const top = (year - this.getStartYear()) * blockHeight;

    scrollTopAnimation(this.scroll, top, scrollTop(this.scroll) !== 0);
  };

  scroll = null;

  addPrefix = (name: string) => prefix(this.props.classPrefix)(name);

  renderBlock() {
    const { date, onSelect, limitEndYear } = this.props;

    const ret = [];
    const selectedMonth = date.month();
    const selectedYear = date.year();
    const startYear = this.getStartYear();
    let nextYear = 0;

    for (let i = 0; i < 100 && nextYear < selectedYear + limitEndYear; i += 1) {
      nextYear = startYear + i;

      let isSelectedYear = nextYear === selectedYear;
      let titleClasses = classNames(this.addPrefix('year'), {
        [this.addPrefix('year-active')]: isSelectedYear
      });

      ret.push(
        <div className={this.addPrefix('row')} key={i}>
          <div className={titleClasses}>{nextYear}</div>
          <div className={this.addPrefix('list')}>
            {/* eslint-disable */
            [...Array(12)].map((i, month) => {
              return (
                <MonthDropdownItem
                  date={date}
                  onSelect={onSelect}
                  active={isSelectedYear && month === selectedMonth}
                  key={month}
                  month={month + 1}
                  year={nextYear}
                />
              );
            })}
          </div>
        </div>
      );
    }

    return ret;
  }

  render() {
    const { classPrefix, className, ...rest } = this.props;
    const classes = classNames(classPrefix, className);
    const unhandled = getUnhandledProps(MonthDropdown, rest);
    return (
      <div {...unhandled} className={classes}>
        <div className={this.addPrefix('content')}>
          <div
            className={this.addPrefix('scroll')}
            ref={ref => {
              this.scroll = ref;
            }}
          >
            {this.renderBlock()}
          </div>
        </div>
      </div>
    );
  }
}

export default MonthDropdown;
