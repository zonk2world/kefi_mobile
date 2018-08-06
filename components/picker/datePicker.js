import React from 'react';
import {
  RkPicker,
} from 'react-native-ui-kitten';

export class DatePicker extends React.Component {
  componentName = 'DatePicker';

  static DatePart = Object.freeze({YEAR: 1, MONTH: 2, DAY: 3});

  constructor(props) {
    super(props);
    this.state = {pickerVisible: false};
    this.days = this.generateArrayFromRange(1, 60);
    this.months = this.generateArrayFromRange(1, 12);
    this.years = [
        {key: 1, value: 'Am'}, {key: 2, value: 'Pm'}
    ];
  }

  handlePickedValue(date) {
    let resultDate = {};
    if (this.props.customDateParts) {
      let i = 0;
      if (this.props.customDateParts.includes(DatePicker.DatePart.MONTH))
        resultDate['month'] = date[i++];
      if (this.props.customDateParts.includes(DatePicker.DatePart.DAY))
        resultDate['day'] = date[i++];
      if (this.props.customDateParts.includes(DatePicker.DatePart.YEAR))
        resultDate['year'] = date[i];
    } else {
      resultDate = { month: date[0], day: date[1], year: date[2] };
    }
    this.props.onConfirm(resultDate);
  };

  generateArrayFromRange(start, finish) {
    return Array.apply(null, Array(finish - start + 1)).map((_, i) => start + i);
  }

  findElementByKey(key, array){
    let element = array[0];
    array.forEach((value) => {
      if (value.key === key) element = value;
    });
    return element;
  }

  render() {
    let {
      onConfirm,
      selectedYear,
      selectedMonth,
      selectedDay,
      customDateParts,
      ...props
    } = this.props;

    let data = [this.months, this.days, this.years];
    let selectedOptions = [selectedMonth, selectedDay || 1, selectedYear];
    if (customDateParts) {
      selectedOptions = [];
      data = [];
      if (customDateParts.includes(DatePicker.DatePart.MONTH)) {
        data.push(this.months);
        selectedOptions.push(selectedMonth);
      }
      if (customDateParts.includes(DatePicker.DatePart.DAY)) {
        data.push(this.days);
        selectedOptions.push(selectedDay || 1);
      }
      if (customDateParts.includes(DatePicker.DatePart.YEAR)) {
        data.push(this.years);
        selectedOptions.push(selectedYear||1);
      }
    }

    return (
      <RkPicker
        rkType='highlight'
        title='Set Time to Now'
        data={data}
        onConfirm={(date) => this.handlePickedValue(date)}
        selectedOptions={selectedOptions}
        optionRkType='subtitle small'
        selectedOptionRkType='header4'
        titleTextRkType='header4'
        cancelTextRkType='light'
        confirmTextRkType=''
        {...props}/>
    );
  }
}