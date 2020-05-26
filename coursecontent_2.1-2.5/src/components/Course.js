import React from 'react'

const Header2 = ({name}) => {
    return (
           <h2>{name}</h2>
        )
  }


const Content = ({part}) => {
    return (
      <div>
          {
              part.map(pa =>  <Part key={pa.id} part={pa}/> )
          }
    
      </div>
      )
  }

const Part = ({part}) => {
  return (
        <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Total = ({parts}) => {
    const total = 
        parts.reduce((prev,next) => prev + next.exercises, 0)
    return (
        <h4>Total of exercises {total}</h4>
    )
}

const Course = ({course}) => {
    return (
        <div>
            <Header2 name={course.name}/>
            <Content part={course.parts} />
            <Total  parts={course.parts}/>
        </div>
    )
  }

export default Course