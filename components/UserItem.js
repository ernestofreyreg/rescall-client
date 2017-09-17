import React from 'react'
import classNames from 'classnames'


const hideNumber = (phone) => {
  return `(***) ***-${phone.substring(phone.length - 4)}`
}

class UserItem extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = { flash: props.first }
  }


  removeFlash = () => {
    this.setState({flash: false})
  }

  componentDidMount() {
    setTimeout(this.removeFlash, 200)
  }

  render() {
    const {intent} = this.props
    const { flash} = this.state

    return (
      <div className={classNames('user-item', {'flash': flash})}>
        <div className='quantity'>
          {intent.quantity || 1}
        </div>
        <div className='resource'>
          {intent.measureUnit
            ? `${intent.measureUnit} of ${intent.resource}`
            : intent.resource
          }
        </div>
        <div className='from'><img src='/static/phone.png'/> {hideNumber(intent.from)}</div>

        {/*language=CSS*/}
        <style jsx>{`
          .user-item {
            display: inline-flex;
            flex-direction: row;
            padding: 10px;
            flex-shrink: 0;
            border-bottom: solid 1px #ccc;
            height: 40px;
            background-color: aliceblue;
            transition: background-color 1s linear;
          }

          .resource {
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            font-size: 18px;
            margin-left: 10px;
          }

          .quantity {
            display: inline-flex;
            flex-direction: column;
            font-size: 28px;
            font-weight: 500;
            justify-content: center;
          }

          .from {
            display: inline-flex;
            flex-direction: row;
            flex-grow: 1;
            justify-content: flex-end;
            align-items: center;

          }

          .flash {
            background-color: orangered;
          }

          .from img {
            width: 16px;
            height: 16px;
          }
        `}</style>
      </div>
    )
  }
}

export default UserItem
