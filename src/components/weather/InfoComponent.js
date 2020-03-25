import React, {useState, useEffect, useContext, useRef, Fragment} from 'react'
import {AddressContext} from '../../context/AddressContext'
import {isUndefined, isEmpty} from 'lodash-es'
import moment from 'moment-timezone'
import {PropTypes} from 'prop-types'
import {FaRegHeart, FaHeart} from 'react-icons/fa'

const InfoComponent = ({address, latlong, urbanArea, weatherCurrent}) => {
  const {updateFavorites} = useContext(AddressContext)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  // store formattedDateTime moment date object in the ref and update it for the first api call fetch
  // this ref will be used to update date and time every second without making additional api calls
  const formattedDateTimeRef = useRef()

  const isBookmarked = () => {
    if (localStorage.getItem('favorites')) {
      const favorites = JSON.parse(localStorage.getItem('favorites'))
      const matched = favorites.filter(
        favorite => favorite.address.cityName === address.cityName
      )
      return matched.length > 0
    }
    return false
  }

  const favoritesHandler = () => {
    // first ever favorite item stored in localStorage
    if (!localStorage.getItem('favorites')) {
      localStorage.setItem(
        'favorites',
        JSON.stringify([{address, latlong, urbanArea}])
      )
      updateFavorites({
        favorites: [{address, latlong, urbanArea}]
      })
    } else {
      const favorites = JSON.parse(localStorage.getItem('favorites'))
      const duplicates = favorites.filter(
        favorite => favorite.address.cityName === address.cityName
      )
      if (!duplicates.length) {
        // add newly added favorite to old favorites
        const updatedFavorites = [...favorites, {address, latlong, urbanArea}]
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
        updateFavorites({
          favorites: updatedFavorites
        })
      } else {
        // if already favorite is selected
        // remove it from favorites
        const removeIndex = favorites.findIndex(
          favorite =>
            favorite.address.cityName === duplicates[0].address.cityName
        )
        if (removeIndex !== -1) {
          const newFavorites = [...favorites]
          newFavorites.splice(removeIndex, 1)
          localStorage.setItem('favorites', JSON.stringify(newFavorites))
          updateFavorites({
            favorites: newFavorites
          })
        }
      }
    }
  }

  // format and set date & time based on the dateObj
  const datetimeSetter = dateObj => {
    setDate(!isUndefined(dateObj) ? dateObj.format('MMMM Do, YYYY') : '')
    setTime(!isUndefined(dateObj) ? dateObj.format('dddd h:mm A') : '')
    formattedDateTimeRef.current = dateObj ? dateObj : null
  }

  useEffect(() => {
    // reset date & time whenever weatherCurrent change
    datetimeSetter(
      moment(weatherCurrent.time * 1000).tz(weatherCurrent.timezone)
    )

    const dateTimer = setInterval(() => {
      if (weatherCurrent.time) {
        // update date and time every second only when there is a valid timestamp
        const formattedDateTimeObj = moment
          .tz(formattedDateTimeRef.current, weatherCurrent.timezone)
          .add(1, 's')
        datetimeSetter(formattedDateTimeObj)
      }
    }, 1000)
    return () => {
      clearInterval(dateTimer)
    }
    // eslint-disable-next-line
  }, [weatherCurrent])

  return (
    <div className='flex justify-between items-start'>
      <div className='pt-4 px-4'>
        <p className='font-bold'>{address.cityName}</p>
        <div className='sm:flex-col md:flex md:flex-row font-light'>
          {!isEmpty(date) && !isEmpty(time) ? (
            <Fragment>
              <p>
                {date}
                <span className='invisible md:visible'>&nbsp;|&nbsp;</span>
              </p>
              <p>{time}</p>
            </Fragment>
          ) : null}
        </div>
      </div>
      <div
        className='mt-6 mr-4 cursor-pointer text-xl'
        title={
          isBookmarked()
            ? 'Remove this city from favorites'
            : 'Favorite this city'
        }
        onClick={favoritesHandler}>
        {isBookmarked() ? <FaHeart /> : <FaRegHeart />}
      </div>
    </div>
  )
}

export default InfoComponent

InfoComponent.propTypes = {
  address: PropTypes.objectOf(PropTypes.string),
  latlong: PropTypes.string,
  urbanArea: PropTypes.object,
  weatherCurrent: PropTypes.object
}
