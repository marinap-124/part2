import React, { useState, useEffect } from 'react'
import personService from './services/persons'


const Filter = ({searchName, handleSearch}) => {
    return (  
        <div>
            filter shown with <input value={searchName} onChange={handleSearch} /> <br/>          
        </div> 
    )
}

const PersonForm = (props) => {
    return (  
        <form  onSubmit={props.addName}>
        <div>
          name: <input value={props.newName} onChange={props.handleNameChange} /> <br/><br/>
          number: <input value={props.newNumber} onChange={props.handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form> 
    )
}


const Person = ({ person, deletingPerson }) => {

  return (         
    <li><div>
       {person.name}  {person.number}
       <button onClick={() => {if (window.confirm(`Delete ${person.name}?`)) {deletingPerson(person.id) }    }}>
           Delete
        </button> 
    </div></li>
  )
}

const Persons = ({persons, deletingPerson}) => {
    return (  
        <div>
            <ul>
            {
              persons.map((person) =>
               
                  <Person deletingPerson={deletingPerson} key={person.name} person={person} />          
              )
            }
            </ul>          
        </div> 
    )
}


const Notification = ({ message, style }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={style}>
      {message}
    </div>
  )
}

const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ searchName, setSearchName ] = useState('')
  const [ message, setMessage] = useState(null)
  const [ style, setStyle] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  console.log('render', persons.length, 'persons')

  const addName = (event) => {
    event.preventDefault()

    const personObject = {
        name: newName,
        number: newNumber
    }

    let names = persons.map(a => a.name);

    if (names.includes(newName) === true) {
      let message = `${newName}  is already added to phonebook, replace the old number with a new one?`
      if (window.confirm(`${message}`)) {updatingPerson(newName) }
    }
    else{  
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')

      personService
      .create(personObject)
        .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })

      setNotification("message",  `Added '${personObject.name}' `)
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)    
  }

  const handleSearch = (event) => {
    setSearchName(event.target.value)
  }

  const personsToShow = persons.filter
    (person => person.name.toLowerCase().includes(searchName.toLowerCase()))
  
  const deletingPerson = id => {
      personService
      .deletePerson(id)
        .then( () => {
          const deleted = persons.filter(person => person.id === id)
          setNotification("message",  `Deleted '${deleted[0].name}' `)
          setPersons(persons.filter(person => person.id !== id))         
      })
    }

  const updatingPerson = name => {
    const person = persons.find(n => n.name === name)
    const changedPerson = { ...person, number: newNumber }
    personService
    .update(person.id, changedPerson).then(returnedPerson => {
      setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
      setNewName('')
      setNewNumber('')
      setNotification("message", `Updated '${person.name}' `)

    })
    .catch(error => {
      setNotification("error", `Information of '${person.name}' has already been removed from server`)
      setPersons(persons.filter(n => n.id !== person.id))
      setNewName('')
      setNewNumber('')
    })
  }

  const setNotification = (style, message) => {
    setStyle(style)
    setMessage(message)

    setTimeout(() => {
      setMessage(null)
    }, 5000)

  }
  
  return (
    <div>
        <h2>Phonebook</h2>

        <Notification message={message} style={style} />

        <Filter searchName={searchName} handleSearch={handleSearch} />
      
        <h2>Add a new</h2>
        <PersonForm addName={addName} 
                    newName={newName} 
                    handleNameChange={handleNameChange} 
                    newNumber={newNumber} 
                    handleNumberChange={handleNumberChange}  />

        <h2>Numbers</h2>
        <Persons   deletingPerson={deletingPerson} persons={personsToShow}/>

    </div>
  )
}

export default App