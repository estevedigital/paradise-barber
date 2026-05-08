const { useState } = React;

export function EventRSVPForm() {

  const [ name, setName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ prefAlim, setPrefAlim ] = useState("");

  const [ numAsist, setNumAsist ] = useState(1);

  const [ invitAd, setInvitAd] = useState(false);
  const [ mostrar, setMostrar ] = useState(false);


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Si');
    setMostrar(true);
  }

  const mostrarTexto = () => {
    return (
      <div>
        <p>RSVP Submitted!</p>
        <p>Name: {name}</p>
        <p>Email: {email}</p>
        <p>Number of attendees: {numAsist}</p>
        <p>Dietary preferences: {prefAlim ? prefAlim : "None"}</p>
        <p>Bringing additional guests: {invitAd ? 'Si' : 'No'}</p>
      </div>
    );
  }

 return (
   <>
    <form onSubmit={handleSubmit}>
      <p>Name</p>
      <input 
      placeholder="Name" 
      type="text" 
      required 
      onChange={e => setName(e.target.value)}/>

      <p>E-mail</p>
      <input 
      placeholder="ejemplo@tumami.com" 
      type="email" 
      required 
      onChange={e => setEmail(e.target.value)}
      />

      <p>Numero de asistentes</p>
      <input 
      placeholder="Ej: 1" 
      type="number" 
      min="1" 
      required
      onChange={e => setNumAsist(e.target.value)}
      />

      <p>Preferencias Alimentarias</p>
      <input 
      placeholder="Comida" 
      type='text'
      onChange={e => setPrefAlim(e.target.value)}
      />

      <p>¿Vas a traer invitados adicionales?</p>
      Si <input 
      type="checkbox" 
      onChange={e => setInvitAd(e.target.value)}
      />
      <button
    type="submit"
    >
    Enviar :)
    </button>
    </form>
    {mostrar && mostrarTexto()}
   </>
 ); 
}

//Es mejor renderizarlo en otro componente en vez de hacer el mostrarTexto()