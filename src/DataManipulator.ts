import { ServerRespond } from './DataStreamer';

const BOUNDARY_DIFFERENCE = 0.05;
export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row {
    const priceABC = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const priceDEF = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2;
    const ratioABCtoDEF = priceABC / priceDEF;
    const upperBound = 1 + BOUNDARY_DIFFERENCE;
    const lowerBound = 1 - BOUNDARY_DIFFERENCE;
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio: ratioABCtoDEF,
      timestamp: serverResponds[0].timestamp > serverResponds[1].timestamp ? serverResponds[0].timestamp : serverResponds[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: (ratioABCtoDEF > upperBound || ratioABCtoDEF < lowerBound ? ratioABCtoDEF : undefined)
    };
  }
}
