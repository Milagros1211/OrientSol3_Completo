function [numeroN2, matriz_angulos2] = Angulos2 (AngSalida)

    %Hace lo mismo que la funcion Angulos, pero creando la matriz de
    %numeroN en 2D y matriz_angulos2 en 3D

    %matriz_angulos = zeros(12,91,n);
    numeroN2 = zeros(12,91);
    
    for i=1:12
        for k =1:91
        
        cont = AngSalida(i,k);
        
        s=-((15/2)*2*pi/360); %15º en radianes. 1 hora = 15º
        n=0;
        r=s;
        
        while cont > (15*2*pi/360)
            
            cont = cont - (15*2*pi/360);
            
            n=n+1;
        
        end
        
        
    %Los valores de W se almacenan en la matriz "matriz_angulos". Ya que las horas del día serán simétricos respecto las 12h 
    %solo para la mitad de los valores.    
        
    num = n; %En OrientSol está restado con 1. Para luego ahorrarsélo.
    
        for j=1:n 
        
            r = r + (15*2*pi/360);
    
            matriz_angulos2(i, k, j) = r;
    
        end
        
        numeroN2(i,k) = num;
       
        end
        
    end

end