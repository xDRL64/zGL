uniforms.color.copy( light.color ).multiplyScalar( light.intensity );
line : 274
in : https://github.com/mrdoob/three.js/blob/dev/src/renderers/webgl/WebGLLights.js



struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};

struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
};

struct PointLight {
	vec3 position;
	vec3 color;
	float distance;
	float decay;
	int shadow;
	float shadowBias;
	float shadowRadius;
	vec2 shadowMapSize;
	float shadowCameraNear;
	float shadowCameraFar;
};
uniform PointLight pointLights[ 2 ];


#define saturate(a) clamp( a, 0.0, 1.0 )

#define PI 3.14159265359

float pow2( const in float x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }







float lightIntensityTo_irradianceFactor( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( PHYSICALLY_CORRECT_LIGHTS )
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#else
		if( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#endif
}

float get_realIrradianceFactor( const in float dist, const in float limit, const in float decay ) {
	float factor = 1.0 / max( pow(dist, decay), 0.01 );
	if( limit > 0.0 ) 
		factor *= pow2( saturate( 1.0 - pow4(dist/limit) ) );
	return factor;
}

float get_unrealIrradianceFactor( const in float dist, const in float limit, const in float decay ) {
		if( limit > 0.0 && decay > 0.0 )
			return pow( saturate( -dist / limit + 1.0 ), decay );
		return 1.0;
}










void getPointDirectLightIrradiance( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight directLight ) {

	vec3 lVector = pointLight.position - geometry.position;
	directLight.direction = normalize( lVector );

	float lightDistance = length( lVector );

	directLight.color = pointLight.color;
	directLight.color *= lightIntensityTo_irradianceFactor( lightDistance, pointLight.distance, pointLight.decay );

	directLight.visible = ( directLight.color != vec3( 0.0 ) );
}

vec3 get_pL_photonRgb( const in pL light, const in vec3 hitPos, const in vec3 hitNor) {

	vec3 ray = light.position - hitPos;
	float dist = length( ray );
	vec3 dir = normalize( ray );
	float dotNL = dot( hitNor, dir );

	vec3 color = light.color * get_unrealIrradianceFactor( dist, light.dis, light.dec );
	vec3 diffuse = PI * color;
	return saturate( dotNL ) * diffuse;
}






// light colors mixing (by addition)
varying vec3 vLightFront;





getPointDirectLightIrradiance( pointLights[ 0 ], geometry, directLight );
dotNL = dot( geometry.normal, directLight.direction );
directLightColor_Diffuse = PI * directLight.color;
vLightFront += saturate( dotNL ) * directLightColor_Diffuse;


getPointDirectLightIrradiance( pointLights[ 1 ], geometry, directLight );
dotNL = dot( geometry.normal, directLight.direction );
directLightColor_Diffuse = PI * directLight.color;
vLightFront += saturate( dotNL ) * directLightColor_Diffuse;








vec3 calc_pointLights(const in pL pLights[9999999], const in vec3 worldPos, const in vec3 worldNor){
	vec3 allPhotonRgb = vec3(0.0);
	for(int i=0; i<9999999; i++)
		allPhotonRgb += get_pL_photonRgb(pLights[i], worldPos, worldNor);
	return allPhotonRgb;
}

// lambert * lightColor
vec3 finalLightColor = calc_pointLights(_pl, _m*vec4(_v, 1.), _m*vec4(_n, 0.));