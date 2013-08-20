

	var   Class 	= require( "ee-class" )
		, crypto 	= require( "crypto" );


	module.exports = new Class( {

		init: function( options ){
			this.provisioned = options.provisioned;
			this.bufferSize = this.provisioned * 2 || 10000;
			this.minimum = options.minimum || this.provisioned;
			this.buffer = new Buffer( this.bufferSize );
			this.offset = 0;
		}


		// if called using the callback there will always random data be returned
		, get: function( size, callback ){
			if ( this.offset > size ){
				if ( callback ) callback( this.buffer.slice( this.offset, size ) );
				else return this.buffer.slice( this.offset, size );
				this.offset -= size; 
			}
			else {
				if ( callback ) { 
					setTimeout( function(){
						this.get( callback );
					}.bind( this ), 100 );
				}
				else {
					var buf = new Buffer( size );
					for( var i = 0, l = buf.length; i< l; i++ ) buf[ i ] = Math.floor( Math.random() * 256 );
					return buf;
				}
			}


			this.__load();
		}




		, __load: function(){
			// dont load if the buffer is filled > 90%
			if ( ( this.offset / this.bufferSize * 100 ) > 10 ){
				crypto.randomBytes( this.bufferSize - this.offset, function( err, data ){
					if ( err ) setTimeout( this.__load, 2000 );
					else {
						data.copy( this.buffer, this.offset );
						this.offset += data.length;
					}
				}.bind( this ) );
			}
		}
	} );