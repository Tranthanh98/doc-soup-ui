import React, { Component } from 'react';

import PromotionLayout from 'features/shared/components/Layout/PromotionLayout';
import ReviewPurchase from './ReviewPurchase';

export default class Purchase extends Component {
  render() {
    const { history } = this.props;
    return (
      <PromotionLayout onPrevious={() => history.goBack()} title="Review & Purchase">
        <ReviewPurchase />
      </PromotionLayout>
    );
  }
}
