import React from "react"
import { useState } from "react"
import { useEffect } from "react"
import "./styles.css"
import "./PokemonList"
import PokemonList from "./PokemonList"
import axios from "axios"
import Pagination from "./Pagination"

export default function App(){

  const[newItem, setNewItem]=useState("Poc vr")
  const[todos,setTodos]=useState([])
  const[pokemon, setPokemon] =useState([]);
  const[currentPageUrl, setCurrentPageUrl]= useState("https://pokeapi.co/api/v2/pokemon");
  const[nextPageUrl, setNextPageUrl] = useState(); 
  const[prevPageUrl, setPrevPageUrl] = useState(); 
  const[loading, setLoading] = useState(true);
  const[pokemonName, setPokemonName]=useState("");
  const[pok, setPok] = useState({ name: "", 
  species: "", img:"", //hp:"",
  attack:"",
  defense:"", type: "" });
  const[pokemonChosen, setPokemonChosen]=useState(false);


  const searchPokemon=() => {
    axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`).then((response)=>{
      // console.log(response);
      setPok({name: pokemonName, 
      species: response.data.species.name, img: response.data.sprites.front_default,
      // hp:response.data.stats[0].base_stat, 
      attack: response.data.stats[1].base_stat,
      defense:response.data.stats[2].base_stat, type: response.data.types[0].type.name})
    })
    setPokemonChosen(true);
  }

  useEffect(() => {
    setLoading(true);
    axios.get(currentPageUrl).then(res => {
      setLoading(false);
      setPrevPageUrl(res.data.previous)
      setNextPageUrl(res.data.next) 
      setPokemon( res.data.results.map(p => p.name))
      //next i previous su nazvani podaci iz pokemon baze
   })
  }, [currentPageUrl])

  function goToNextPage(){
    setCurrentPageUrl(nextPageUrl);

  }

  function goToPreviousPage(){
    setCurrentPageUrl(prevPageUrl);
  }
   

   if (loading) return "Loading";

  function handleSubmit(e){
    e.preventDefault();
    setTodos((current) => {
      return [
        ...current, {id: crypto.randomUUID(),
        name: newItem, completed: false, vatreni: true }
      ]
    })
    setNewItem("")
  }
  console.log(todos);

  function toggleTodo(id, completed){
    setTodos(current => {
      return current.map(todo => {
        if(todo.id === id) {
          return{...todo, completed}
        }
        return todo;
      })
    })
  }

  function deleteTodo(id) {
    setTodos( current =>{
      return current.filter(todo => todo.id !=id)
    })
  }

  
  return (
    <>
   
  <form  onSubmit={handleSubmit} className="new-item-form">
    <div className="form-row">
    <h1> To do lista: </h1>
      <label htmlFor="item">to do: </label>
      <input value={newItem} 
       onChange={e => setNewItem(e.target.value)}
      type="text" id="item" placeholder="Enter pokemon name"/>

      {/* <label htmlFor="password"> Password: </label>
      <input type="password" id="pass" placeholder="Enter your password"></input>
      <button className="btn"> Login </button> */}
      <button className="add-btn"> Dodaj</button>

    </div>

  </form>

  <h2> Lista dodatih stvari: </h2>
  <ul className="list">
    {todos.length ===0 && "Nema dodatih podataka"}
    {todos.map(todo => {
      return   (
      <li key={todo.id}>
      <label>
        <input type="checkbox" checked={todo.completed}
        onChange={e => toggleTodo(todo.id, e.target.chacked)}/>
        {todo.name}
      </label>
      <button onClick={() => deleteTodo(todo.id)} className="btn-danger"> Delete</button>
    </li>
      )
    })}

    
 </ul>

 <input type="text" className="inp" onChange={(event)=>{setPokemonName(event.target.value)}}/>
 <button className="search-btn" onClick={searchPokemon}>Search Pokemon</button>

 <div className="DisplaySection">
       {!pokemonChosen ? (<h2>Izaberi pokemona</h2>) : (
       <>
       <h2>{pok.name}</h2>
       <img src={pok.img}/>
       <h3>Tip:{pok.type}</h3> 
       <h3> Ime: {pok.species}</h3>
       <h3>Odbrana: {pok.defense}</h3>
       {/* <h3>Hp:{pok.hp}</h3> */}
      
       </>)}
 </div>
  
  <PokemonList pokemon={pokemon} />
  <Pagination 
    goToNextPage={nextPageUrl ? goToNextPage : null}
    goToPreviousPage={prevPageUrl ? goToPreviousPage: null}
  />
  



  </>

  
  )
  
  }