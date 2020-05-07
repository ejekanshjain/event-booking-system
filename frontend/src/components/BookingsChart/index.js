import React from 'react'
import { Bar } from 'react-chartjs-2'

import './style.css'

const BOOKINGS_BUCKET = {
    Cheap: {
        min: 0,
        max: 200
    },
    Normal: {
        min: 200,
        max: 1000
    },
    Expensive: {
        min: 1000,
        max: 1000000
    }
}

const BookingsChart = props => {
    const options = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
    const data = {
        datasets: [],
        labels: ['Bookings Comparison Chart']
    }
    Object.keys(BOOKINGS_BUCKET).forEach(key => {
        let obj = {
            label: key,
            data: []
        }
        let filteredBookingsCount = props.bookings.reduce((prev, current) => {
            if (current.event.price >= BOOKINGS_BUCKET[key].min && current.event.price < BOOKINGS_BUCKET[key].max)
                return prev + 1
            return prev
        }, 0)
        obj.data.push(filteredBookingsCount)
        data.datasets.push(obj)
    })
    console.log(data)
    return (
        <div>
            <Bar data={data} options={options} />
        </div>
    )
}

export default BookingsChart