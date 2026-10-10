function Val_Bod = Bod0 (DIA_INTER,LAT_RAD,Val_decli,AngSal1)

%En "Val_Bod" se almacenan los valores de radiación extraterrestre para
%cada mes del año.

B0 = 1367;

Val_Bod = zeros(1, 12);

for i=1:12
    
    e0=1+0.033*(cos((2*pi*DIA_INTER(i))/365));
    
    Val_Bod(i) =(24/pi)*B0*e0*cos(LAT_RAD)*cos(Val_decli(i))*(sin(AngSal1(i))-(AngSal1(i)*cos(AngSal1(i))));
    
end