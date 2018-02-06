// @flow

import * as React from 'react';
import type { Moment } from 'moment';
import classNames from 'classnames';
import _ from 'lodash';
import { constants } from 'rsuite-utils/lib/Picker';
import TableRow from './TableRow';
import TableHeaderRow from './TableHeaderRow';

type Props = {
  rows: Array<any>,
  isoWeek?: boolean,
  selected?: Moment,
  onSelect?: () => void,
  disabledDate?: (date: Moment) => boolean,
  inSameMonth?: (date: Moment) => boolean,
  className?: string,
  classPrefix?: string
};


class Table extends React.Component<Props> {
  static defaultProps = {
    classPrefix: `${constants.namespace}-calendar-table`,
    rows: []
  };


  shouldComponentUpdate(nextProps: Props) {
    return !_.isEqual(this.props, nextProps);
  }

  render() {
    const {
      rows,
      selected,
      onSelect,
      disabledDate,
      inSameMonth,
      className,
      classPrefix,
      isoWeek,
      ...rest
    } = this.props;

    const classes = classNames(classPrefix, className);

    return (
      <div
        {...rest}
        className={classes}
      >

        <TableHeaderRow isoWeek={isoWeek} />

        {
          rows.map((week, index) => (
            <TableRow
              /* eslint-disable */
              key={index}
              weekendDate={week}
              selected={selected}
              onSelect={onSelect}
              inSameMonth={inSameMonth}
              disabledDate={disabledDate}
            />
          ))
        }
      </div>
    );
  }
}

export default Table;