function [Gh_matriz,matriz_rg] = Gh0(matriz_angulos,AngSal1,numeroN,DATOS)

%En la matriz "Gh_matriz" se almacenan los valores horarios de la radiación
%global sobre superficie horizontal

    %matriz_rg = zeros(12,numeroN(i));
    %Gh_matriz = zeros(12,numeroN(i));

    for i=1:12
        for j=1:numeroN(i)
        
            a = 0.409 + (0.5016*sin(AngSal1(i)-1.047));
            b = 0.6609 - (0.4767*sin(AngSal1(i)-1.047));
        
            rg1 = (pi/24)*(a + b * cos(matriz_angulos(i,j)))*((cos(matriz_angulos(i,j))-cos(AngSal1(i)))/(sin(AngSal1(i))-(AngSal1(i)*cos(AngSal1(i)))));

            matriz_rg(i,j)= rg1;
        
        end
    
    end
    
    for u=1:12
        for v=1:numeroN(u)
            
            Gh_matriz(u, v) = matriz_rg(u, v) * DATOS(u+2);
    
        end
    end
end