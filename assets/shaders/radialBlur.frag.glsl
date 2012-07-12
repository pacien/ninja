
/* <copyright>
Copyright (c) 2012, Motorola Mobility LLC.
All Rights Reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of Motorola Mobility LLC nor the names of its
  contributors may be used to endorse or promote products derived from this
  software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
</copyright> */

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_speed;
uniform sampler2D u_tex0;


void main(void)
{
    vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / u_resolution.xy;
    vec2 s = p;

	float time = u_time * u_speed;
    float c1 = 1.1*time,  c2 = 1.2*time,  c3 = 0.6+1.1*time;
    float sc3 = sin(c3),  st = sin(time);

    const float iterCount = 40.0;
    const int iIterCount = int( iterCount );
    
    vec3 sum = vec3(0.0);
    vec2 delta = -p/iterCount;
    vec2 uv;
    for( int i=0; i<iIterCount; i++ )
    {
        vec2 q = vec2( sin(c1 + s.x), sin(c2 + s.y) );
        float a = atan(q.y,q.x);
        float rsq = abs(dot(q,q)) + 1.0;
        uv.x =  st + s.x*rsq;
        uv.y = sc3 + s.y*rsq;
        vec3 res = texture2D(u_tex0, uv*.5).xyz;

        res = smoothstep(0.1,1.0,res*res);
        sum += res;
        s += delta;
    }
    sum /= iterCount;
    float r = 1.5/(1.0+dot(p,p));

    gl_FragColor = vec4( sum*r, 1.0);
}