import React from 'react'

const Total = ({total}) => (
  <div className='total'>
    <div className='resource'>{total.name}</div>
    <div className='quantity'>{total.value} <span className='measureUnit'>{total.measureUnit}</span></div>

    {/*language=CSS*/}
    <style jsx>{`
      .total {
        display: inline-flex;
        flex-direction: column;
        flex-grow: 1;
      }

      .total .quantity {
        font-size: 120px;
        font-weight: 500;
        display: inline-flex;
        justify-content: center;
        align-items: center;
      }

      .total .resource {
        font-size: 40px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        text-transform: capitalize;
      }

      .total .measureUnit {
        font-size: 20px;
      }
    `}</style>
  </div>
)

export default Total
