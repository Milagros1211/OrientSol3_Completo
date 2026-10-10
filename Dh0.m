function [Dh_matriz,matriz_rd] = Dh0(matriz_angulos,AngSal1,numeroN,Val_Ddm0)

%En la matriz "Dh_matriz" se almacenan los valores horarios de la radiación
%difusa sobre superficie horizontal

    %matriz_rd = zeros(12,numeroN(i));
    %Dh_matriz = zeros(12,numeroN(i));

    for i=1:12
       for j=1:numeroN(i)
           
            rd1 = (pi/24) * (cos(matriz_angulos(i,j))-cos(AngSal1(i)))/(sin(AngSal1(i))-(AngSal1(i)*cos(AngSal1(i))));
            
            matriz_rd(i,j)= rd1;
            
        end   
        
    end

    for u=1:12
        for v=1:numeroN(u)
            
            Dh_matriz(u,v)= matriz_rd(u,v)* Val_Ddm0(u);
            
        end
    end
    
    
end
