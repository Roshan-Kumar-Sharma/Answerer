for( let i = 1; i < 13; i += 1 )
{
    let cc = "cc" + i;
    document.querySelector( `#${cc}` ).addEventListener( 'click', () => {
        location.href = `http://localhost:2000/api/v1/subjects/${cc}/topics`;
        console.log( "Hello" + i );
    } );
}